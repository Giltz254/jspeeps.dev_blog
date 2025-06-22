export const getSummaryFromEditorJS = async ({
  blocks,
  customPrompt,
}: {
  blocks?: any[];
  customPrompt: string;
}) => {
  const res = await fetch("/api/generate-summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      blocks ? { blocks, customPrompt } : { customPrompt }
    ),
  });

  if (!res.ok) {
    return "";
  }

  const data = await res.json();
  return data.result;
};
