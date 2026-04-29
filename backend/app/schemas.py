from pydantic import BaseModel, ConfigDict, Field


class AnalyzeRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    product_name: str = Field(..., min_length=1, max_length=120)
    niche: str = Field(..., min_length=1, max_length=120)
    product_cost: float = Field(..., ge=0)
    selling_price: float = Field(..., gt=0)
    target_customer: str = Field(..., min_length=1, max_length=300)


class AnalyzeResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    trend_angle: str
    target_audience: str
    competition_level: str
    margin_analysis: str
    tiktok_hooks: list[str] = Field(..., min_length=5, max_length=5)
    tiktok_ad_scripts: list[str] = Field(..., min_length=3, max_length=3)
    captions: list[str] = Field(..., min_length=5, max_length=5)
    offer_ideas: list[str] = Field(..., min_length=3, max_length=3)
    risk_warnings: list[str]


class HealthResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: str
