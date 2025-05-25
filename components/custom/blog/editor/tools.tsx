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
export const getTools = (uploadImageByFile: (file: File) => Promise<any>) => ({
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: ImageTool,
    config: {
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
  link: LinkTool,
  header: {
    class: Header,
    config: {
      placeholder: "Type heading...",
      levels: [1, 2, 3],
      defaultLevel: 2,
    },
  },
});
