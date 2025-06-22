"use server";
import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { revalidateTag } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { profileSchema } from "@/schemas/UserProfileSchema";
interface UpdateUserResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>; 
}

export const updateUser = async (
  prevState: any,
  formData: FormData 
): Promise<UpdateUserResult> => {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { success: false, message: "Unauthorized. Please log in." };
    }
    const currentUserId = session.user.id;
    const rawInput = Object.fromEntries(formData.entries());
    const dataToValidate = {
      ...rawInput,
      password: rawInput.password === "" ? undefined : rawInput.password,
      bio: rawInput.bio === "" ? undefined : rawInput.bio,
      website: rawInput.website === "" ? undefined : rawInput.website,
      twitter: rawInput.twitter === "" ? undefined : rawInput.twitter,
    };
    const validatedFields = profileSchema.safeParse(dataToValidate);
    if (!validatedFields.success) {
      const fieldErrors: Record<string, string[]> = {};
      validatedFields.error.errors.forEach((err: any) => {
        if (err.path && err.path.length > 0) {
          const fieldName = err.path[0];
          if (!fieldErrors[fieldName]) {
            fieldErrors[fieldName] = [];
          }
          fieldErrors[fieldName].push(err.message);
        }
      });
      return {
        success: false,
        message: "Validation failed.",
        errors: fieldErrors,
      };
    }

    const { name, username, password, bio, website, twitter } = validatedFields.data;
    const user = await getUserById(currentUserId);
    if (!user) {
      return { success: false, message: "User does not exist!" };
    }
    const updateData: Record<string, any> = {
      name,
      username,
      bio,
      website,
      twitter,
    };
    if (user.provider === "credentials" && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    } else if (user.provider !== "credentials" && password) {
      console.warn("Password provided for a non-credentials user. Ignoring.");
    }
    await db.user.update({
      where: { id: currentUserId },
      data: updateData,
    });
    revalidateTag("users");
    revalidateTag("blogs");
    return { success: true, message: "Profile updated successfully!" };

  } catch (error) {
    console.error("Error updating user profile:", error);
    if (error instanceof Error && (error as any).code === 'P2002' && (error as any).meta?.target?.includes('username')) {
        return { success: false, message: "Username already taken. Please choose a different one." };
    }
    return { success: false, message: "An unexpected error occurred." };
  }
};