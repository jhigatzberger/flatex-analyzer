import { Typography } from "@mui/material";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <div className="overflow-y-auto p-4 w-full max-h-screen">
      <div className="prose dark:prose-invert"><Typography component={"div"}>{children}</Typography></div>
    </div>
  );
}
