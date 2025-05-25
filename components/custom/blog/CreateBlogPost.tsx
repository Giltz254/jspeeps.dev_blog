"use client";

import { BlogSchema, BlogSchemaType } from "@/schemas/BlogShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../forms/FormField";
import AddCover from "./AddCover";
import { useCallback, useEffect, useState, useTransition } from "react";
import CoverImage from "./CoverImage";
import TagInput from "./Tag";
import dynamic from "next/dynamic";
import ReusableButton from "../forms/ReusableButton";
import { cn } from "@/lib/utils";
import Alert from "../forms/Alert";
import { createBlog } from "@/actions/blogs/create-blog";
import { OutputBlockData } from "@editorjs/editorjs";
import { useSearchParams } from "next/navigation";
import { getBlogBySlug } from "@/actions/blogs/get-blog-by-slug";
const Editorjs = dynamic(() => import("./editor/EditorJs"), {
  ssr: false,
});
interface CreateBlogPostProps {
  availableTags: string[] | [];
}
const CreateBlogPost = ({ availableTags }: CreateBlogPostProps) => {
  const session = useSession();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? undefined;
  const userId = session.data?.user.id;
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [content, setContent] = useState<OutputBlockData[] | undefined>();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPublishing, startPublishing] = useTransition();
  const [isSavingAsDraft, startSavingAsDraft] = useTransition();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const maxDescriptionLength = 160;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<BlogSchemaType>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      isPublished: false,
      tags: [],
      userId,
    },
  });
  const description = watch("description") || "";
  const isOutputBlockArray = (data: any): data is OutputBlockData[] => {
    return (
      Array.isArray(data) &&
      data.every(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.type === "string" &&
          "data" in item
      )
    );
  };
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!slug) {
        setContent([]);
        setIsEditMode(false);
        setIsEditorReady(true);
        return;
      }

      try {
        const blogData = await getBlogBySlug({ slug });
        const blog = blogData.success?.blog;
        if (!blog) {
          setError("The document you're searching does not exist!");
        }
        if (blog) {
          const contentData = blog.content;
          const parsedContent = isOutputBlockArray(contentData)
            ? contentData
            : undefined;

          reset({
            title: blog.title || "",
            content: parsedContent || [],
            description: blog.description || "",
            isPublished: blog.isPublished || false,
            tags: blog.tags || [],
            userId: blog.userId || userId || "",
            coverImage: blog.coverImage || "",
          });

          setUploadedCover(blog.coverImage ?? undefined);
          setContent(parsedContent);
          setIsEditMode(true);
          setIsEditorReady(true);
        }
      } catch (error) {
        setError("Failed to fetch blog data.");
      }
    };

    fetchBlogData();
  }, [slug]);
  useEffect(() => {
    if (userId) {
      setValue("userId", userId, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [userId]);
  useEffect(() => {
    if (uploadedCover) {
      setValue("coverImage", uploadedCover, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [uploadedCover]);
  useEffect(() => {
    if (Array.isArray(content)) {
      setValue("content", content, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [content]);
  const handleChange = useCallback((blocks: OutputBlockData[]) => {
    setContent(blocks);
  }, []);
  const handleCreateBlog: SubmitHandler<BlogSchemaType> = (data) => {
    setError("");
    setSuccess("");
    if (data.tags.length > 4) {
      return setError("Only 4 tags are required!");
    }
    startPublishing(() => {
      createBlog({ ...data, isPublished: true, slug }).then((res) => {
        if (res.error) {
          setError(res.error);
        }
        if (res.success) {
          setSuccess(res.success);
          reset();
        }
      });
    });
  };
  const handleDraftBlog = () => {
    setError("");
    setSuccess("");

    const values = getValues();

    if (!values.title || values.title.trim() === "") {
      setError("Title is required to save a draft.");
      return;
    }
    startSavingAsDraft(() => {
      createBlog({ ...values, isPublished: false, slug }).then((res) => {
        if (res.error) {
          setError(res.error);
        }
        if (res.success) {
          setSuccess(res.success);
          reset();
        }
      });
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white px-4 min-h-[calc(100vh-64px)]">
      <form
        className="py-10 flex flex-col gap-y-10"
        onSubmit={handleSubmit(handleCreateBlog)}
      >
        <div>
          {!!uploadedCover && (
            <CoverImage
              url={uploadedCover}
              isEdit={isEditMode}
              isEditor={true}
              setUploadedCover={setUploadedCover}
            />
          )}
          {!uploadedCover && <AddCover setUploadedCover={setUploadedCover} />}
        </div>
        <FormField
          id="title"
          register={register}
          errors={errors}
          placeholder="Blog Title"
          disabled={isPublishing}
          inputClassNames="text-xl placeholder:text-gray-800"
        />
        <div>
          <FormField
            id="description"
            register={register}
            errors={errors}
            placeholder="Blog Description"
            disabled={isPublishing}
            inputClassNames="text-xl placeholder:text-gray-800"
          />
          <div className="text-sm text-gray-700 text-right pt-2">
            {maxDescriptionLength - description.length} characters remaining
          </div>
        </div>
        <TagInput
          tags={watch("tags")}
          setValue={setValue}
          watch={watch}
          errors={errors}
          availableTags={availableTags}
        />
        {errors.tags && errors.tags.message && (
          <span className="text-base text-rose-500">{errors.tags.message}</span>
        )}
        {isEditorReady && (
          <Editorjs
            onChange={handleChange}
            initialData={{ blocks: content || [] }}
          />
        )}
        {errors.content && errors.content.message && (
          <span className="text-base text-rose-500">
            {errors.content.message}
          </span>
        )}
        <div>
          {errors.userId && errors.userId.message && (
            <span className="text-base text-rose-500">Missing UserId</span>
          )}
          {error && <Alert message={error} error />}
          {success && <Alert message={success} success />}
        </div>

        <div className="flex items-center justify-between gap-4">
          <ReusableButton
            disabled={isPublishing}
            type="submit"
            label={
              isPublishing
                ? isEditMode
                  ? "Editing..."
                  : "Creating..."
                : isEditMode
                  ? "Edit"
                  : "Create"
            }
            className={cn(
              "inline-flex w-auto items-center justify-center border align-middle select-none font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm py-2 px-4 shadow-sm hover:shadow-md bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition"
            )}
          />
          <ReusableButton
            onClick={handleDraftBlog}
            type="button"
            disabled={isSavingAsDraft}
            label={isSavingAsDraft ? "Saving..." : "Save Draft"}
            className={cn(
              "inline-flex w-auto items-center justify-center border align-middle select-none font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm py-2 px-4 shadow-sm hover:shadow-md bg-gray-200 hover:bg-gray-300 relative bg-gradient-to-b from-gray-200 to-gray-300 border-gray-400 text-gray-800 hover:bg-gradient-to-b hover:from-gray-300 hover:to-gray-300 hover:border-gray-500 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.1)] after:pointer-events-none transition"
            )}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
