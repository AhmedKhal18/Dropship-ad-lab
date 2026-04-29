import json
from os import getenv

from dotenv import load_dotenv
from fastapi import HTTPException
from openai import AsyncOpenAI

from .prompts import SYSTEM_PROMPT, build_analysis_prompt
from .schemas import AnalyzeRequest, AnalyzeResponse

load_dotenv()


async def analyze_product(payload: AnalyzeRequest) -> AnalyzeResponse:
    api_key = getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured.")

    client = AsyncOpenAI(api_key=api_key)

    try:
        response = await client.responses.create(
            model=getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            input=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_analysis_prompt(payload)},
            ],
            text={
                "format": {
                    "type": "json_schema",
                    "name": "dropship_ad_analysis",
                    "schema": AnalyzeResponse.model_json_schema(),
                    "strict": True,
                }
            },
        )

        return AnalyzeResponse.model_validate(json.loads(response.output_text))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Failed to analyze product.") from exc
