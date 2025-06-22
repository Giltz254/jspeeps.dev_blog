import { auth } from "@/auth";

export const getUserId = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  return session.user.id;
};
