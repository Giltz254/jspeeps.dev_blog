"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/user";

export const verifyEmail = async (token: string) => {
  const verificationToken = await db.verificationToken.findUnique({
    where: {
      token,
    },
  });
  if (!verificationToken) {
    return { error: "Verification token doesn't exist!" };
  }
  const isExpired = new Date(verificationToken.expires) < new Date();
  if (isExpired) {
    return { error: "Verification token has expired!" };
  }
  const existingUser = await getUserByEmail(verificationToken.email);
  if (!existingUser) {
    return { error: "User does not exist!" };
  }
  try {
    await db.user.update({
      where: {
        email: verificationToken.email,
      },
      data: {
        emailVerified: new Date(),
        email: verificationToken.email,
      },
    });
    await db.verificationToken.delete({
      where: {
        token,
      },
    });
    return { success: "email verified! Please log in to continue." };
  } catch (error) {
    return { error: "Something went wrong! Please try again" };
  }
};
