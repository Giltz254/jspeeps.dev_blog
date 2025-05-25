import Image from "next/image";
import React from "react";
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

const Quote = ({ quote, caption }: { quote: string; caption: string }) => {
  return (
    <div className="bg-ndigo-700/10 rounded-md p-6 border-l-4 border-ndigo-600">
      <p className="text-lg leading-relaxed text-secondary md:text-xl font-semibold">
        {quote}
      </p>
      {caption.length > 0 && (
        <p className="mt-3 text-dark text-sm md:text-base italic text-right">
          {caption}
        </p>
      )}
    </div>
  );
};

const List = ({ style, items }: { style: any; items: any }) => {
  return (
    <ol
      className={`pl-5 ${style === "ordered" ? "list-decimal" : "list-disc"}`}
    >
      {items.map((listitem: any, i: number) => (
        <li
          key={i}
          className="my-4"
          dangerouslySetInnerHTML={{ __html: listitem.content }}
        ></li>
      ))}
    </ol>
  );
};


const Code = ({ code }: { code: string }) => {
  return (
    <pre className="bg-grey border relative border-border drop-shadow-sm p-4 lg:max-w-[calc(100vw-400px)] xl:max-w-[600px] overflow-x-auto ">
      <div className="absolute right-0 top-0 mt-1 mr-1">
        {/* <CopyButton text={code} /> */}
      </div>
      <code className="" dangerouslySetInnerHTML={{ __html: code }}></code>
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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-border">
        <thead>
          <tr className="bg-grey">
            {headers.length > 0 ? (
              headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border-b border-r border-border text-primary text-lg font-medium capitalize"
                >
                  {header}
                </th>
              ))
            ) : (
              <th className="px-4 py-2 border-b">No Headers</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-grey">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 border-r border-border text-base text-dark font-normal border-b"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-4 py-2 text-center">
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
const BlogContent = ({ blog }: { blog: any }) => {
  let { type, data } = blog;
  if (type === "paragraph") {
    return (
      <p
        className="text-lg text-black font-normal text-justify"
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></p>
    );
  }
  if (type === "header") {
    const headers = [
      "text-2xl first-letter:capitalize font-bold",
      "text-xl first-letter:capitalize font-bold",
      "text-lg first-letter:capitalize font-bold",
      "text-base first-letter:capitalize font-bold",
      "text-base first-letter:capitalize font-bold",
      "text-sm first-letter:capitalize font-bold",
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

  return <h1>Hello</h1>;
};

export default BlogContent;
