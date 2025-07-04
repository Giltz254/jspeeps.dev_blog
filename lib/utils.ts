import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import * as UAParser from 'ua-parser-js';
export type Block = {
  id: string;
  type: string;
  data: {
    text?: string;
    items?: string[];
  };
};
type EditorBlock = {
  type: string;
  data: any;
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") 
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};
export const formatTimeFromNow = (date: Date) => {
  const fromNow = moment(new Date(date)).fromNow();
  return fromNow
};
export const formatDate = (date: string | Date): string => {
  return moment(date).format('MMM D, YYYY');
};

export default formatDate;
export const calculateReadTimeFromBlocks = (
  blocks: { type: string; data: any }[],
  wordsPerMinute = 200,
  imageReadSeconds = 12
): string => {
  let wordCount = 0;
  let imageCount = 0;

  for (const block of blocks) {
    if (["paragraph", "header", "quote"].includes(block.type)) {
      const text = block.data?.text || "";
      const plainText = text.replace(/<[^>]+>/g, "");
      wordCount += plainText.trim().split(/\s+/).filter(Boolean).length;
    }
    if (block.type === "image") {
      imageCount += 1;
    }
  }
  const textMinutes = wordCount / wordsPerMinute;
  const imageMinutes = (imageCount * imageReadSeconds) / 60;
  const totalMinutes = Math.ceil(textMinutes + imageMinutes);
  return `${totalMinutes} min read`;
};
export const generateUniqueSlug = async (
  title: string
): Promise<string | null> => {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;

  for (let i = 0; i < 5; i++) {
    const existing = await db.blog.findFirst({ where: { slug } });
    if (!existing) return slug;

    const randomStr = uuidv4();
    slug = `${baseSlug}-${randomStr}`;
  }
  return null;
};
export const calculateReadTime = (content: Block[]): string => {
  const wordsPerMinute = 200;
  const textContent = content.map((block) => {
    if (block.type === "paragraph" || block.type === "header") {
      return block.data.text || "";
    }
    if (block.type === "list" && Array.isArray(block.data.items)) {
      return block.data.items.join(" ");
    }
    return "";
  });
  const totalWords = textContent.join(" ").trim().split(/\s+/).length;
  const minutes = Math.ceil(totalWords / wordsPerMinute);
  return `${minutes} min read`;
}

export function getUserAgentDetails(uaString: string) {
  const parser = new UAParser.UAParser(uaString);
  const browser = parser.getBrowser().name || "Browser";
  const os = parser.getOS().name || "OS";
  return { browser, os };
}