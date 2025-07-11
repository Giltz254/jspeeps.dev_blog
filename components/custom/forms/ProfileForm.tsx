"use client";

import { useState, useEffect, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReusableButton from "./ReusableButton";
import { profilePageProps } from "@/app/(home)/(user)/settings/profile/page";
import formatDate from "@/lib/utils";
import { updateUser } from "@/actions/users/update-user";
import { profileSchema } from "@/schemas/UserProfileSchema";
import {
  showErrorToast,
  showSuccessToast,
  showInfoToast,
} from "../layout/Toasts";
import { getSummaryFromEditorJS } from "@/lib/ai";
import FormField from "./FormField";
import { Edit } from "lucide-react";
import FormTextarea from "./FormTextarea";
type ProfileFormFields = z.infer<typeof profileSchema>;
interface ProfileFormProps {
  user: profilePageProps;
}
export default function ProfileForm({ user }: ProfileFormProps) {
  const [prompt, setPrompt] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    setError,
    clearErrors,
  } = useForm<ProfileFormFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      bio: user.bio || "",
      website: user.website || "",
      twitter: user.twitter || "",
    },
  });

  useEffect(() => {
    reset({
      name: user.name,
      username: user.username,
      bio: user.bio || "",
      website: user.website || "",
      twitter: user.twitter || "",
    });
    setIsEditing(false);
    clearErrors();
  }, [user, reset]);

  const handleGenerateBio = async () => {
    if (!prompt.trim()) {
      showErrorToast("Please enter a prompt for your bio.");
      return;
    }
    showInfoToast("Generating bio, please wait...");
    try {
      const generatedBioSummary = await getSummaryFromEditorJS({
        customPrompt: prompt,
      });
      if (generatedBioSummary) {
        setValue("bio", generatedBioSummary);
        showSuccessToast(
          "Bio generated successfully! Review and save if you like it."
        );
      } else {
        showErrorToast(
          "Failed to generate bio. Please try a different prompt."
        );
      }
    } catch (error) {
      console.error("Error generating bio:", error);
      showErrorToast(
        "An error occurred while generating the bio. Please try again."
      );
    }
  };

  const onSubmit = (data: ProfileFormFields) => {
    clearErrors();
    const formData = new FormData();
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key as keyof ProfileFormFields];
        if (key === "password" && user.provider !== "credentials") {
          continue;
        }
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        } else if (
          key === "bio" ||
          key === "website" ||
          key === "twitter" ||
          key === "password"
        ) {
          formData.append(key, "");
        }
      }
    }
    startTransition(async () => {
      const result = await updateUser(null, formData);
      if (result.success) {
        showSuccessToast(result.message || "Profile updated successfully!");
        setValue("password", "");
        setIsEditing(false);
      } else {
        if (result.errors) {
          for (const field in result.errors) {
            setError(field as keyof ProfileFormFields, {
              type: "server",
              message: result.errors[field][0],
            });
          }
          showErrorToast(
            result.message || "Please correct the errors in the form."
          );
        } else {
          showErrorToast(
            result.message || "An error occurred while updating your profile."
          );
        }
      }
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    showInfoToast("You are now in edit mode.");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Personal Information
        </h1>
        {!isEditing && (
          <ReusableButton
            onClick={handleEditClick}
            type="button"
            className="w-max"
            leftIcon={<Edit className="w-4 h-4" />}
            label="Edit"
          />
        )}
      </div>
      <p className="text-gray-600 mb-6 text-base">
        This information will be displayed publicly on your profile.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm w-fit">
          👋 Joined on {formatDate(user.emailVerified)}
        </div>

        <FormField
          id="name"
          label="Name"
          placeholder="Elon Kiptoo"
          register={register}
          errors={errors}
          disabled={!isEditing}
        />

        <FormField
          id="username"
          label="Username"
          placeholder="yourusername"
          register={register}
          errors={errors}
          disabled={!isEditing}
          leftIcon={<span className="text-gray-500">@</span>}
        />

        {user.provider === "credentials" ? (
          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="********"
            register={register}
            errors={errors}
            disabled={!isEditing}
          />
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="w-full md:w-1/4 text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="w-full">
                <input
                  id="email"
                  value={user.email}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed w-full border rounded-md p-2"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="w-full md:w-1/4 text-sm font-medium text-gray-700">
                Sign-in Method
              </label>
              <div className="w-full text-gray-800 font-semibold capitalize">
                {user.provider}
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <label
            htmlFor="bio-prompt"
            className="w-full md:w-1/4 text-sm font-medium text-gray-700"
          >
            Generate Bio Prompt
          </label>
          <div className="w-full">
            <FormTextarea
              id="bio-prompt"
              placeholder="Write a prompt to generate your bio"
              value={prompt}
              onChange={(e) => isEditing && setPrompt(e.target.value)}
              disabled={!isEditing}
            />

            {isEditing && (
              <ReusableButton
                onClick={handleGenerateBio}
                type="button"
                label="Generate Bio"
                className="mt-4 w-max"
                disabled={isPending}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <label
            htmlFor="bio"
            className="w-full md:w-1/4 text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <div className="w-full">
            <FormTextarea
              id="bio"
              register={register}
              errors={errors}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <FormField
          id="website"
          label="Website URL"
          placeholder="https://yourwebsite.com"
          register={register}
          errors={errors}
          disabled={!isEditing}
        />

        <FormField
          id="twitter"
          label="Twitter Handle"
          placeholder="https://twitter.com/yourhandle"
          register={register}
          errors={errors}
          disabled={!isEditing}
        />

        {isEditing && (
          <div className="text-right pt-4">
            <ReusableButton
              type="submit"
              disabled={isPending}
              className="w-max"
              label={isPending ? "Saving..." : "Save Changes"}
            />
          </div>
        )}
      </form>
    </div>
  );
}
