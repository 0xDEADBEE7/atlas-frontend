import type { ButtonHTMLAttributes } from "react";

const variants = {
  default: "border-border bg-white",
  primary: "border-accent bg-accent text-white shadow-sm",
  secondary: "w-full border-border bg-surface",
  quiet: "border-transparent bg-transparent text-muted",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({
  variant = "default",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-md border px-[13px] py-[9px] text-[11px] font-medium whitespace-nowrap ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
