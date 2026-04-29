const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type AnalyzeRequest = {
  product_name: string;
  niche: string;
  product_cost: number;
  selling_price: number;
  target_customer: string;
};

export type AnalyzeResponse = {
  trend_angle: string;
  target_audience: string;
  competition_level: string;
  margin_analysis: string;
  tiktok_hooks: string[];
  tiktok_ad_scripts: string[];
  captions: string[];
  offer_ideas: string[];
  risk_warnings: string[];
};

export async function analyzeProduct(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.detail ?? "Unable to analyze this product right now.");
  }

  return response.json();
}
