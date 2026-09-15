import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";

const controlClass =
  "mt-[7px] block w-full rounded-[5px] border border-border bg-white px-[10px] py-[9px] leading-[1.55] text-ink focus:border-[#8dac92] focus:outline-2 focus:outline-[#73997c44]";

export function FormField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-[10px] text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={`${controlClass} text-[11px] ${className}`} {...props} />
  );
}
export function Textarea({
  variant = "default",
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: "default" | "code";
}) {
  return (
    <textarea
      className={`${controlClass} resize-y ${variant === "code" ? "font-mono text-[10px]" : "text-[11px]"} ${className}`}
      {...props}
    />
  );
}
export function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${controlClass} text-[11px] ${className}`} {...props} />
  );
}
