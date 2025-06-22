"use client";
type EmbedProps = {
  embed: string;
  caption?: string;
  width?: string | number;
  height?: string | number;
};
const Embed = ({
  embed,
  caption,
  width = "100%",
  height = "100%",
}: EmbedProps) => {
  return (
    <div className="my-8 w-full flex flex-col items-center">
      <div className="w-full aspect-video max-w-4xl border border-muted border-b-0 overflow-hidden">
        <iframe
          src={embed}
          title={caption || "Embedded video"}
          width={width || "100%"}
          height={height || "100%"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      {caption && (
        <p className="text-base text-black bg-white px-4 border border-border py-2 border-l-4 border-l-teal-700 w-full font-[family-name:var(--font-lora)]">
          {caption}
        </p>
      )}
    </div>
  );
};
export default Embed