import RawTool from "@editorjs/raw";
import LinkTool from "@editorjs/link";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import Checklist from "@editorjs/checklist";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import Table from "@editorjs/table";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import ColorPicker from "editorjs-color-picker";
import { ToolConstructable } from "@editorjs/editorjs";
export const getTools = (uploadImageByFile: (file: File) => Promise<any>) => ({
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: ImageTool,
    config: {
      features: {
        caption: "optional",
      },
      uploader: {
        uploadByUrl: async (url: string) => ({
          success: 1,
          file: { url },
        }),
        uploadByFile: uploadImageByFile,
      },
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  code: CodeTool,
  table: Table,
  inlineCode: InlineCode,
  marker: Marker,
  checklist: Checklist,
  raw: RawTool,
  ColorPicker: {
    class: ColorPicker as unknown as ToolConstructable,
    config: {},
  },
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: `/api/blogs/url`,
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type heading...",
      levels: [1, 2, 3],
      defaultLevel: 2,
    },
  },
});
