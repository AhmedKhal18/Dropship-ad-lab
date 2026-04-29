from .schemas import AnalyzeRequest


SYSTEM_PROMPT = """You are Dropship Ad Lab, an ecommerce ad strategist.
Return practical, specific analysis for a dropshipping seller testing a product with TikTok ads.
Be concise, direct, and realistic. Do not mention that you are an AI.
Return only valid JSON that matches the requested schema."""


def build_analysis_prompt(payload: AnalyzeRequest) -> str:
    gross_margin = payload.selling_price - payload.product_cost
    margin_percent = (gross_margin / payload.selling_price) * 100

    return f"""Analyze this dropshipping product idea and produce structured JSON.

Product name: {payload.product_name}
Niche: {payload.niche}
Product cost: ${payload.product_cost:.2f}
Selling price: ${payload.selling_price:.2f}
Gross margin: ${gross_margin:.2f}
Gross margin percent: {margin_percent:.1f}%
Target customer: {payload.target_customer}

Required JSON keys:
- trend_angle: string
- target_audience: string
- competition_level: string
- margin_analysis: string
- tiktok_hooks: array of exactly 5 short hooks
- tiktok_ad_scripts: array of exactly 3 short TikTok ad scripts
- captions: array of exactly 5 captions
- offer_ideas: array of exactly 3 offer ideas
- risk_warnings: array of practical risk warnings
"""
