import { getComments } from "@/actions/comments/get-comments";
export async function POST(req: Request) {
  const body = await req.json();
  const { blogId, parentId, userId, page, limit } = body;

  const result = await getComments(blogId, parentId, userId, page, limit);
  return Response.json(result);
}
