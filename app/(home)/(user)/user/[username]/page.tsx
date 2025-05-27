import React from "react";
interface BlogUserProps {
  params: Promise<{ username: string }>;
}
const page = async({ params }: BlogUserProps) => {
  const { username } = await params;
  console.log("username>>>", username)
  return <div>page</div>;
};

export default page;
