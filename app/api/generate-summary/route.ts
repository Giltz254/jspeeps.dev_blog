import { generateContent } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  function extractTextFromHTML(html: string) {
    if (!html) return "";
    if (typeof window !== "undefined" && window.DOMParser) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    }
    return html.replace(/<[^>]*>?/gm, "");
  }
  try {
    const { blocks, customPrompt } = await req.json();

    if (!customPrompt) {
      return NextResponse.json(
        { error: "customPrompt is required" },
        { status: 400 }
      );
    }
    const contentText = Array.isArray(blocks)
      ? blocks
          .map((block: any) => {
            const { type, data } = block;

            switch (type) {
              case "paragraph":
                return data.text || "";
              case "header":
                return `\n${"#".repeat(data.level || 2)} ${data.text || ""}`;
              case "list":
                return data.items
                  .map((item: any, idx: number) => {
                    const text = extractTextFromHTML(item.content || "");
                    return data.style === "ordered"
                      ? `${idx + 1}. ${text}`
                      : `- ${text}`;
                  })
                  .join("\n");

              case "checklist":
                return data.items
                  .map((item: any) => {
                    const text = extractTextFromHTML(item.content || "");
                    return `- [${item.checked ? "x" : " "}] ${text}`;
                  })
                  .join("\n");
              case "quote":
                return `> ${data.text || ""}`;
              case "code":
                return `\n\`\`\`\n${data.code || ""}\n\`\`\``;
              case "table":
                const rows = data.content || [];
                if (!rows.length) return "";
                const headerRow = rows[0].map((cell: any) => cell || "");
                const separatorRow = headerRow.map(() => "---");
                const bodyRows = rows.slice(1);
                const tableMarkdown =
                  "| " +
                  headerRow.join(" | ") +
                  " |\n| " +
                  separatorRow.join(" | ") +
                  " |\n" +
                  bodyRows
                    .map((row: any[]) => "| " + row.join(" | ") + " |")
                    .join("\n");
                return tableMarkdown;
              case "raw":
                return data.html || "";
              case "embed":
                return data.caption || data.source || "";
              case "inlineCode":
                return `\`${data.code || ""}\``;
              case "marker":
                return data.text || "";
              case "linkTool":
                return data.link || data.meta?.title || "";
              case "image":
                return data.caption || "";
              default:
                return "";
            }
          })
          .filter(Boolean)
          .join("\n\n")
      : "";
    const prompt = `${customPrompt}\n\n${contentText}`;
    const result = await generateContent(prompt);
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate content" },
      { status: 503 }
    );
  }
}
