import json
import logging
from os import getenv

from dotenv import load_dotenv
from fastapi import HTTPException
from openai import AsyncOpenAI
from pydantic import ValidationError

from .prompts import SYSTEM_PROMPT, build_analysis_prompt
from .schemas import AnalyzeRequest, AnalyzeResponse

load_dotenv()

logger = logging.getLogger(__name__)

DEFAULT_MODEL = "gpt-4.1-mini"
DISCLAIMERS = [
    "This is not financial advice.",
    "Validate demand before spending on ads.",
    "Revenue is not profit.",
]


class InvalidAIOutputError(ValueError):
    pass


def _json_response_format() -> dict:
    return {
        "type": "json_schema",
        "json_schema": {
            "name": "dropship_ad_analysis",
            "schema": AnalyzeResponse.model_json_schema(),
            "strict": True,
        }
    }


async def _request_analysis(client: AsyncOpenAI, payload: AnalyzeRequest, retry: bool) -> str:
    user_prompt = build_analysis_prompt(payload)
    if retry:
        user_prompt += (
            "\n\nThe previous response could not be parsed or validated. "
            "Retry with only valid JSON that exactly matches the schema."
        )

    response = await client.chat.completions.create(
        model=getenv("OPENAI_MODEL", DEFAULT_MODEL),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        response_format=_json_response_format(),
    )

    content = response.choices[0].message.content
    if not content:
        raise InvalidAIOutputError("OpenAI returned an empty response.")

    return content


def _validate_output(raw_output: str) -> AnalyzeResponse:
    parsed = json.loads(raw_output)
    analysis = AnalyzeResponse.model_validate(parsed)

    risk_warnings = list(analysis.risk_warnings)
    for disclaimer in DISCLAIMERS:
        if disclaimer not in risk_warnings:
            risk_warnings.append(disclaimer)

    return analysis.model_copy(update={"risk_warnings": risk_warnings})


async def analyze_product(payload: AnalyzeRequest) -> AnalyzeResponse:
    api_key = getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY is not configured.")
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured.")

    client = AsyncOpenAI(api_key=api_key)

    last_validation_error: Exception | None = None
    try:
        for attempt in range(2):
            try:
                raw_output = await _request_analysis(client, payload, retry=attempt == 1)
                return _validate_output(raw_output)
            except (json.JSONDecodeError, ValidationError, InvalidAIOutputError) as exc:
                last_validation_error = exc
                logger.warning(
                    "OpenAI response validation failed on attempt %s for product=%r: %s",
                    attempt + 1,
                    payload.product_name,
                    exc,
                )

        logger.error(
            "OpenAI returned invalid JSON after retry for product=%r: %s",
            payload.product_name,
            last_validation_error,
        )
        raise HTTPException(
            status_code=500,
            detail="The AI response could not be parsed safely. Please try again.",
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("OpenAI analysis request failed for product=%r.", payload.product_name)
        raise HTTPException(
            status_code=500,
            detail="Unable to analyze this product right now. Please try again shortly.",
        ) from exc
