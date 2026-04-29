import { FormEvent, useState } from "react";
import { AnalyzeRequest, AnalyzeResponse, analyzeProduct } from "./api";

const emptyForm: AnalyzeRequest = {
  product_name: "",
  niche: "",
  product_cost: 0,
  selling_price: 0,
  target_customer: "",
};

function ResultList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-slate-50 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <dt className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-slate-800">{value}</dd>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState<AnalyzeRequest>(emptyForm);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: keyof AnalyzeRequest, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: field === "product_cost" || field === "selling_price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const result = await analyzeProduct(form);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 border-b border-slate-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Dropship Ad Lab
          </p>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Turn a product idea into a practical TikTok ad test plan.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Enter the basics, then get positioning, margin notes, hooks, scripts, captions,
            offers, and risks in one pass.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Product name</span>
                <input
                  required
                  value={form.product_name}
                  onChange={(event) => updateField("product_name", event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Mini portable blender"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Niche</span>
                <input
                  required
                  value={form.niche}
                  onChange={(event) => updateField("niche", event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Fitness, beauty, pets"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Product cost</span>
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.product_cost}
                    onChange={(event) => updateField("product_cost", event.target.value)}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Selling price</span>
                  <input
                    required
                    min="0.01"
                    step="0.01"
                    type="number"
                    value={form.selling_price}
                    onChange={(event) => updateField("selling_price", event.target.value)}
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Target customer</span>
                <textarea
                  required
                  rows={4}
                  value={form.target_customer}
                  onChange={(event) => updateField("target_customer", event.target.value)}
                  className="mt-2 w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Busy college students who want quick healthy snacks"
                />
              </label>

              {error ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoading ? "Analyzing..." : "Analyze product"}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            {!analysis && !isLoading ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
                Your analysis will appear here after you submit a product.
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                Building your ad lab output...
              </div>
            ) : null}

            {analysis ? (
              <>
                <dl className="grid gap-4 md:grid-cols-2">
                  <Insight label="Trend angle" value={analysis.trend_angle} />
                  <Insight label="Target audience" value={analysis.target_audience} />
                  <Insight label="Competition level" value={analysis.competition_level} />
                  <Insight label="Margin analysis" value={analysis.margin_analysis} />
                </dl>

                <div className="grid gap-4 xl:grid-cols-2">
                  <ResultList title="TikTok hooks" items={analysis.tiktok_hooks} />
                  <ResultList title="TikTok ad scripts" items={analysis.tiktok_ad_scripts} />
                  <ResultList title="Captions" items={analysis.captions} />
                  <ResultList title="Offer ideas" items={analysis.offer_ideas} />
                </div>

                <ResultList title="Risk warnings" items={analysis.risk_warnings} />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
