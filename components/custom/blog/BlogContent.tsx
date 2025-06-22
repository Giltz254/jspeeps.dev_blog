import Image from "next/image";
import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import CopyButton from "./Copy";
import EmbedWrapper from "./EmbedWrapper";
import Link from "next/link";
import parse, {
  domToReact,
  Element as HtmlElement,
  DOMNode,
} from "html-react-parser";
type ListProps = {
  style: "ordered" | "unordered";
  items: { content: string }[];
};
const Img = ({ url, caption }: { url: string; caption: string }) => {
  return (
    <div>
      <div className="relative h-64 w-full bg-muted-foreground border border-border overflow-hidden">
        <Image
          src={url}
          alt="image"
          fill
          className="object-cover"
          sizes="(max-width: 991px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {caption.length > 0 && (
        <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">
          {caption}
        </p>
      )}
    </div>
  );
};
const Checklist = ({ items }: { items: { text: string; checked: boolean }[] }) => {
  return (
    <ul className="space-y-3 mt-4 list-none">
      {items.map((item, index) => (
        <li
          key={index}
          className={`flex items-start gap-3 list-none p-3 rounded-lg border ${
           item.checked ? "bg-slate-50 border-slate-200" : "bg-white border-slate-100"
          } shadow-sm transition duration-200`}
        >
          <div className="flex-shrink-0">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                item.checked
                  ? "border-slate-500 bg-slate-500"
                  : "border-slate-300 bg-white"
              }`}
            >
              {item.checked && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-gray-800 text-base">{item.text}</span>
        </li>
      ))}
    </ul>
  );
};

const Quote = ({ quote, caption }: { quote: string; caption: string }) => {
  return (
    <div className="relative flex gap-4">
      <div className="relative w-4">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[2px] h-full bg-slate-500" />
        <FaQuoteLeft className="absolute top-1/2 -translate-y-1/2 -left-1 text-slate-500 text-base bg-white" />
      </div>
      <div>
        <p className="text-slate-800 text-base md:text-lg leading-relaxed">
          {quote}
        </p>
        {caption.length > 0 && (
          <p className="mt-2 text-sm text-slate-500 text-start">— {caption}</p>
        )}
      </div>
    </div>
  );
};

const List = ({ style, items }: ListProps) => {
  return (
    <ol
      className={`pl-6 sm:pl-8 lg:pl-10 text-base sm:text-lg lg:text-xl leading-relaxed tracking-normal ${
        style === "ordered" ? "list-decimal" : "list-disc"
      } marker:text-neutral-500 marker:font-medium marker:text-lg`}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className="mb-3 text-neutral-800 dark:text-neutral-200"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      ))}
    </ol>
  );
};

const Code = ({ code }: { code: string }) => {
  return (
    <pre className="relative bg-[#f9fafb] dark:bg-[#1e1e1e] text-sm text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-md p-4 overflow-x-auto max-w-full lg:max-w-[calc(100vw-400px)] xl:max-w-[700px]">
      <CopyButton code={code} />
      <code dangerouslySetInnerHTML={{ __html: code }} />
    </pre>
  );
};

const Table = ({
  headers = [],
  rows = [],
}: {
  headers?: string[];
  rows?: string[][];
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 text-gray-700 text-base capitalize tracking-wider">
          <tr>
            {headers.length > 0 ? (
              headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left font-semibold border-b border-gray-200"
                >
                  {header}
                </th>
              ))
            ) : (
              <th className="px-6 py-3 text-left font-semibold border-b border-gray-200">
                No Headers
              </th>
            )}
          </tr>
        </thead>
        <tbody className="text-gray-800 text-base font-normal">
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  rowIndex % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50 hover:bg-gray-100"
                }
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 border-b border-gray-200"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length || 1}
                className="px-6 py-4 text-center text-gray-500"
              >
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
const LinkPreview = ({
  link,
  meta,
}: {
  link: string;
  meta: { title: string; description: string; image?: { url?: string } };
}) => {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col sm:flex-row items-start gap-4 border border-slate-200 rounded-xl p-4 my-6 transition duration-300"
    >
      {meta.image?.url && (
        <div className="relative min-w-[120px] min-h-[80px] w-[120px] h-[80px] sm:w-[160px] sm:h-[100px] overflow-hidden rounded-md bg-slate-100">
          <Image
            src={meta.image.url}
            alt={meta.title || "Link preview"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 160px"
          />
        </div>
      )}
      <div className="flex-1 text-start">
        <p className="text-lg font-semibold text-slate-800 hover:underline line-clamp-1">
          {meta.title}
        </p>
        <p className="text-slate-600 text-sm mt-1 line-clamp-2">
          {meta.description}
        </p>
        <span className="text-xs text-slate-400 mt-2 block">{link}</span>
      </div>
    </Link>
  );
};
const BlogContent = ({ blog }: { blog: any }) => {
  function isAnchorElement(node: DOMNode): node is HtmlElement {
    return node.type === "tag" && (node as HtmlElement).name === "a";
  }
  let { type, data } = blog;
  if (type === "paragraph") {
    return (
      <p className="lg:text-xl text-lg text-black font-normal text-justify">
        {parse(data.text, {
          replace: (domNode: DOMNode) => {
            if (isAnchorElement(domNode)) {
              const { href } = domNode.attribs || {};
              if (!href) return;

              const isInternal = href.startsWith("/");
              return (
                <Link
                  href={href}
                  className="text-blue-600 hover:underline"
                  target={isInternal ? "_self" : "_blank"}
                  rel={isInternal ? undefined : "noopener noreferrer"}
                >
                  {domToReact(domNode.children as DOMNode[])}
                </Link>
              );
            }
          },
        })}
      </p>
    );
  }
  if (type === "header") {
    const headers = [
      "font-bold text-4xl md:text-5xl lg:text-6xl text-black",
      "font-bold text-3xl md:text-4xl lg:text-5xl text-black",
      "text-2xl md:text-3xl lg:text-4xl text-black",
      "text-xl md:text-2xl lg:text-3xl text-black",
      "font-bold text-lg md:text-xl lg:text-2xl text-black",
      "font-bold text-base md:text-lg lg:text-xl text-black",
    ];

    const level = Math.max(1, Math.min(data.level, 6));
    const tag = `h${level}`;

    return React.createElement(tag, {
      className: headers[level - 1],
      dangerouslySetInnerHTML: { __html: data.text },
    });
  }
  if (type === "image") {
    return <Img url={data.file.url} caption={data.caption} />;
  }
  if (type === "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }
  if (type === "list") {
    return <List style={data.style} items={data.items} />;
  }
  if (type === "code") {
    return <Code code={data.code} />;
  }
  if (type === "table") {
    const [headers, ...rows] = data.content;
    return <Table headers={headers} rows={rows} />;
  }
  if (type === "embed") {
    return (
      <EmbedWrapper
        embed={data.embed}
        caption={data.caption}
        width={data.width}
        height={data.height}
      />
    );
  }
  if (type === "linkTool") {
    return <LinkPreview link={data.link} meta={data.meta} />;
  }
  if (type === "checklist") {
    return <Checklist items={data.items} />;
  }

  return <h1>Hello</h1>;
};

export default BlogContent;
