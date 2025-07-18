import { linkToolFetch } from "@/actions/blogs/link-fetch";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (url) {
    const result = await linkToolFetch(url);
    return NextResponse.json(result);
  }
}
