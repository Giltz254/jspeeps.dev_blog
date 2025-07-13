"use client";

import { BlogSchema, BlogSchemaType } from "@/schemas/BlogShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../forms/FormField";
import AddCover from "./AddCover";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import CoverImage from "./CoverImage";
import TagInput from "./Tag";
import dynamic from "next/dynamic";
import ReusableButton from "../forms/ReusableButton";
import { createBlog } from "@/actions/blogs/create-blog";
import { OutputBlockData } from "@editorjs/editorjs";
import { redirect, useSearchParams } from "next/navigation";
import { getBlogById } from "@/actions/blogs/get-blog-by-id";
import { getSummaryFromEditorJS } from "@/lib/ai";
import { showErrorToast, showSuccessToast } from "../layout/Toasts";
import { FilePenLine, LucideHeading1, Plus } from "lucide-react";
import { BsCardText } from "react-icons/bs";
import { MdOutlineDrafts } from "react-icons/md";
import { calculateReadTime } from "@/lib/utils";
const Editorjs = dynamic(() => import("./editor/EditorJs"), {
  ssr: false,
});

interface CreateBlogPostProps {
  availableTags: string[] | [];
  userId: string | null;
}

const CreateBlogPost = ({ availableTags, userId }: CreateBlogPostProps) => {
  if (!userId) {
    redirect(`/login`);
  }
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [editorContent, setEditorContent] = useState<
    OutputBlockData[] | undefined
  >();
  const [isPublishing, startPublishing] = useTransition();
  const [isSavingAsDraft, startSavingAsDraft] = useTransition();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [summary, setSummary] = useState<string>("");
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (summaryRef.current) {
      summaryRef.current.style.height = "auto";
      summaryRef.current.style.height = `${summaryRef.current.scrollHeight}px`;
    }
  }, [summary]);

  const maxDescriptionLength = 160;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    trigger,
  } = useForm<BlogSchemaType>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      isPublished: false,
      tags: [],
      userId,
      featured: false,
      content: [],
    },
    mode: "onSubmit",
  });

  const description = watch("description") || "";
  const currentContent = watch("content");
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
      if (!id) {
        setEditorContent([]);
        setIsEditMode(false);
        setIsEditorReady(true);
        return;
      }
      try {
        let blog: any = [];
        await getBlogById({ id }).then((res) => {
          if (res.error) {
            showErrorToast(res.error);
          }
          if (res.success) {
            blog = res.success?.blog;
          }
        });
        if (!blog) {
          showErrorToast("The document you're searching does not exist!");
          setEditorContent([]);
          setIsEditorReady(true);
          return;
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
          setSummary(blog.summary ?? "");
          setUploadedCover(blog.coverImage ?? undefined);
          setEditorContent(parsedContent);
          setIsEditMode(true);
          setIsEditorReady(true);
        }
      } catch (error) {
        showErrorToast("Failed to fetch blog data.");
        setEditorContent([]);
        setIsEditorReady(true);
      }
    };

    fetchBlogData();
  }, [id, reset]);

  useEffect(() => {
    if (userId) {
      setValue("userId", userId, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [userId, setValue]);

  useEffect(() => {
    if (uploadedCover) {
      setValue("coverImage", uploadedCover, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [uploadedCover, setValue]);
  const handleGenerateSummary = async () => {
    if (!Array.isArray(currentContent) || currentContent.length === 0) {
      showErrorToast("Add some content before generating a summary.");
      return;
    }

    try {
      const filteredBlocks = currentContent.filter(
        (block) => block.type !== "linkTool"
      );

      const summaryText = await getSummaryFromEditorJS({
        blocks: filteredBlocks,
        customPrompt:
          "Summarize the following blog post into a single, well-written paragraph. Do not use bullet points, numbers, or any formatting. The summary should be concise, engaging, and easy to understand, capturing the main ideas, tone, and purpose of the post for readers seeking a quick overview.",
      });

      if (summaryText) {
        setSummary(summaryText);
        showSuccessToast("Summary generated successfully!");
      } else {
        setSummary("");
        showErrorToast("Failed to generate summary.");
      }
    } catch (error) {
      showErrorToast("An error occurred while generating summary.");
    }
  };
  const handleChange = useCallback(
    async (blocks: OutputBlockData[]) => {
      setValue("content", blocks, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setEditorContent(blocks);
      await trigger("content");
    },
    [setValue, trigger]
  );
  const handleCreateBlog: SubmitHandler<BlogSchemaType> = (data) => {
    data.featured = false;
    if (data.tags.length > 4) {
      return showErrorToast("Only 4 tags are required!");
    }
    if (userId) {
      const payload = {
        ...data,
        summary,
        isPublished: true,
        id,
        featured: false,
      };
      if (data.content && data.content.length > 0) {
        payload.readtime = calculateReadTime(data.content);
      }
      startPublishing(() => {
        createBlog(payload).then((res) => {
          if (res.error) {
            showErrorToast(res.error);
          }
          if (res.success) {
            showSuccessToast(res.success);
            reset({
              title: "",
              description: "",
              isPublished: false,
              tags: [],
              userId: userId ?? "",
              content: [],
            });
            setUploadedCover(undefined);
            setEditorContent([]);
            setEditorKey((prev) => prev + 1);
            setSummary("");
          }
        });
      });
    }
  };
  const handleDraftBlog = async () => {
    const values = getValues();
    values.featured = false;
    if (!values.title || values.title.trim() === "") {
      showErrorToast("Title is required to save a draft.");
      return;
    }
    const payload = {
      ...values,
      summary,
      isPublished: false,
      id,
    };
    if (values.content && values.content.length > 0) {
      payload.readtime = calculateReadTime(values.content);
    }
    startSavingAsDraft(() => {
      createBlog(payload).then((res) => {
        if (res.error) {
          showErrorToast(res.error);
        }
        if (res.success) {
          showSuccessToast(res.success);
          reset({
            title: "",
            description: "",
            isPublished: false,
            tags: [],
            userId: userId ?? "",
            content: [],
          });
          setUploadedCover(undefined);
          setEditorContent([]);
          setEditorKey((prev) => prev + 1);
          setSummary("");
        }
      });
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white px-4 min-h-[calc(100vh-64px)]">
      <form
        className="flex flex-col gap-y-10"
        onSubmit={handleSubmit(handleCreateBlog)}
      >
        <div className="flex items-center flex-wrap justify-end gap-4 border-b py-4 sticky top-16 bg-white z-10">
          <ReusableButton
            type="submit"
            className="w-max"
            leftIcon={isEditMode ? <FilePenLine /> : <Plus />}
            disabled={isPublishing}
            label={
              isPublishing
                ? isEditMode
                  ? "Editing..."
                  : "Creating..."
                : isEditMode
                  ? "Edit"
                  : "Create"
            }
          />
          <ReusableButton
            leftIcon={<MdOutlineDrafts />}
            onClick={handleDraftBlog}
            type="button"
            className="w-max"
            disabled={isSavingAsDraft}
            label={isSavingAsDraft ? "Saving..." : "Save Draft"}
          />
        </div>
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
          leftIcon={<LucideHeading1 />}
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
            leftIcon={<BsCardText />}
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
          <span className="text-sm text-rose-500">{errors.tags.message}</span>
        )}
        {isEditorReady && (
          <Editorjs
            key={editorKey}
            onChange={handleChange}
            initialData={{ blocks: editorContent || [] }}
          />
        )}
        {errors.content && errors.content.message && (
          <span className="text-sm text-rose-500">
            {errors.content.message}
          </span>
        )}
        <div>
          <label
            htmlFor="summary"
            className="block text-base font-medium text-gray-700 mb-1"
          >
            AI-Generated Summary
          </label>
          <textarea
            id="summary"
            ref={summaryRef}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={1}
            className="w-full resize-none overflow-hidden bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
            placeholder="AI will summarize your content here..."
            style={{ height: "auto" }}
          />
          <ReusableButton
            type="button"
            onClick={handleGenerateSummary}
            className="mt-2 w-max"
            label="Generate Summary"
          />
        </div>

        <div>
          {errors.userId && errors.userId.message && (
            <span className="text-base text-rose-500">Missing UserId</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
