"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showSuccessToast } from "./Toasts";
import { ContactSchema, ContactSchemaType } from "@/schemas/ContactSchema";
import FormField from "../forms/FormField";
import { MdMailOutline } from "react-icons/md";
import ReusableButton from "../forms/ReusableButton";
import FormTextarea from "../forms/FormTextarea";
import { Send } from "lucide-react";

const categoriesList = [
  "Billing & plans",
  "Connections",
  "Sign in & up",
  "Channels",
  "Notifications",
  "Mobile experience",
  "Workspace managing",
];

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactSchemaType>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      email: "",
      topic: "",
      categories: [],
    },
  });
  const selectedCategories = watch("categories");
  const toggleCategory = (category: string) => {
    const current = getValues("categories") || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setValue("categories", updated);
  };
  const onSubmit = (data: ContactSchemaType) => {
    console.log("Form submitted:", data);
    showSuccessToast("Request Sent! We'll get back to you soon.");
    reset();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm  uppercase font-medium text-gray-700"
          >
            Your Email Address
          </label>
          <FormField
            leftIcon={<MdMailOutline size={24} className="text-black" />}
            id="email"
            type="email"
            placeholder="Enter your email"
            register={register}
            errors={errors}
          />
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  selectedCategories?.includes(category)
                    ? "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
                    : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="text-center">
            <span className="text-gray-400 text-sm font-medium">OR</span>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="topic"
            className="block text-sm uppercase font-medium text-gray-700"
          >
            Can't find above? Tell us below:
          </label>
          <FormTextarea
            id="topic"
            errors={errors}
            register={register}
            placeholder="Enter your topic"
          />
        </div>
        <ReusableButton
          leftIcon={<Send />}
          type="submit"
          className="w-max"
          label="Send your request"
        />
      </form>
    </div>
  );
};

export default ContactForm;
