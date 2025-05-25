import { db } from "./db";
import { v4 as uuidv4 } from 'uuid';
import { Resend } from "resend";
import PasswordResetEmailTemplate from "@/templates/password-reset-template";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4(); 
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return passwordResetToken;
};
export const sendPasswordResetToken = async (
  email: string,
  token: string,
  name: string,
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const passwordResetLink = `${process.env.BASE_URL}/new-password?token=${token}`;
  const res = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Password Reset for Your Account",
    react: PasswordResetEmailTemplate({name, passwordResetLink})
  });
  return { error: res.error}
};
