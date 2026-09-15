import type { ReactNode } from "react";
import "@xyflow/react/dist/style.css";
import "@/app/globals.css";

export const metadata = {
  title: "Polaris",
  description: "Business process modelling",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
