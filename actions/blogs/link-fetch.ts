"use server";
import * as cheerio from "cheerio";

export const linkToolFetch = async (url: string) => {
  if (!url) {
    return { success: 0, message: "Missing URL!" };
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90 Safari/537.36",
      },
    });

    if (!res.ok) {
      return { success: 0, message: `Failed to fetch page. Status: ${res.status}` };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const getMeta = (name: string) =>
      $(`meta[property='${name}']`).attr("content") ||
      $(`meta[name='${name}']`).attr("content");

    const title = getMeta("og:title") || $("title").text() || "No title";
    const description = getMeta("og:description") || getMeta("description") || "";
    const image = getMeta("og:image") || "";

    return {
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: image,
        },
      },
    };
  } catch (error: any) {
    console.error("Error fetching metadata:", error.message);
    return { success: 0, message: "Something went wrong! Please try again." };
  }
};
