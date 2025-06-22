"use client";
import { useState } from "react";
import { getSummaryFromEditorJS } from "@/lib/ai";
import ReusableButton from "../forms/ReusableButton";
import { showErrorToast } from "../layout/Toasts";

type GeneratedTitle = {
  title: string;
  rationale: string;
};

const SEOKeywordTitleGenerator = () => {
  const [generatedTitles, setGeneratedTitles] = useState<GeneratedTitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (title: string, index: number) => {
    navigator.clipboard.writeText(title);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const cleanJSON = (raw: string) => {
    return raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
  };

  const fetchTitles = async () => {
    const prompt = `
You're an experienced SEO and keyword research expert helping with content planning for a blog called "Jspeeps" — a go-to source for JavaScript, web development, and the latest in tech trends.

Here's what I need from you:
1. Do up-to-date keyword research for the current year (${new Date().getFullYear()}) focused on JavaScript, web development, and tech-related topics.
2. Find trending keywords with high search volume and low competition that would be a great fit for Jspeeps.
3. Based on that data, suggest 4 blog post titles that are highly optimized for SEO.

Please follow these title guidelines:
- Start each title with the most important keyword for better search engine visibility.
- Keep each title close to 60 characters for the best appearance in search results.
- Avoid filler words like “and,” “for,” “you,” “they,” etc.
- Use title case for clarity and professional presentation.
- Make sure the titles work well in both title tags and URL slugs.

Format your response as a clean JSON array like this:
[
  {
    "title": "Example Blog Title Starting With Keyword",
    "rationale": "Brief explanation of why this keyword is valuable for SEO right now"
  }
]

Return only valid JSON — no code blocks, markdown, or extra text.
`;

    try {
      setLoading(true);
      const response = await getSummaryFromEditorJS({ customPrompt: prompt });
      const clean = cleanJSON(response);
      const parsed = JSON.parse(clean);
      setGeneratedTitles(parsed);
    } catch (err) {
    showErrorToast("Something went wrong! Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-8 border-t">
      <h2 className="text-2xl text-center pt-4 font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
        SEO Blog Title Ideas for Jspeeps
      </h2>
      <ReusableButton
        onClick={fetchTitles}
        disabled={loading}
        className="rounded-sm mb-4"
        label={loading ? "Generating..." : "Generate Titles"}
      />
      {generatedTitles.length > 0 && (
        <div className="space-y-6">
          {generatedTitles.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-neutral-200 dark:border-neutral-700 bg-white relative"
            >
              <h3 className="text-lg font-medium text-black mb-1 flex items-center gap-2">
                {index + 1}. {item.title}
                <button
                  onClick={() => handleCopy(item.title, index)}
                  className={`ml-2 cursor-pointer px-3 py-1 text-sm rounded-md border transition-colors duration-200 ${
                    copiedIndex === index
                      ? "bg-emerald-100 text-emerald-600 border-emerald-300"
                      : "bg-white text-emerald-500 border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                  title="Copy title"
                >
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                {item.rationale}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SEOKeywordTitleGenerator;
