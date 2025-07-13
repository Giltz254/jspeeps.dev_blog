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
export const calculateReadTime = (
  blocks: { type: string; data: any }[],
  wordsPerMinute = 200
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
  let imageSeconds = 0;
  for (let i = 1; i <= imageCount; i++) {
    imageSeconds += Math.max(12 - (i - 1), 3);
  }
  const imageMinutes = imageSeconds / 60;
  const totalMinutes = Math.ceil(textMinutes + imageMinutes);
  return `${totalMinutes || 1} min read`;
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
export function getUserAgentDetails(uaString: string) {
  const parser = new UAParser.UAParser(uaString);
  const browser = parser.getBrowser().name || "Browser";
  const os = parser.getOS().name || "OS";
  return { browser, os };
}