import { db } from "./db";
import { v4 as uuidv4 } from 'uuid';
import { Resend } from "resend";
import VerificationTokenEmailTemplate from '@/templates/email-template'

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};
export const generateEmailVerificationToken = async (email: string) => {
  const token = uuidv4(); 
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const emailVerificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return emailVerificationToken;
};
export const sendEmailVerificationToken = async (
  email: string,
  token: string,
  name: string,
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const emailVerificationLink = `${process.env.BASE_URL}/login?token=${token}`;
  const res = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Account Verification Email",
    react: VerificationTokenEmailTemplate({name, emailVerificationLink})
  });
  return { error: res.error}
};
