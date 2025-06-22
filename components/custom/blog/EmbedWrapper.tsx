"use client";
import dynamic from "next/dynamic";

const Embed = dynamic(() => import("./Embed"), { ssr: false });

type EmbedWrapperProps = {
  embed: string;
  caption?: string;
  width?: string | number;
  height?: string | number;
};

const EmbedWrapper = (props: EmbedWrapperProps) => {
  return <Embed {...props} />;
};

export default EmbedWrapper;
