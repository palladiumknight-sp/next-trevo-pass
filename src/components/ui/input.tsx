import { FieldError } from "react-hook-form";
import { InputHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label: string;
  error?: FieldError;
}

export function Input({
  icon: Icon,
  label,
  error,
  ...props
}: InputProps) {
  return (
    <>
      <div className="flex flex-row items-center gap-1 px-2 py-1 border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-violet-900">
        <label htmlFor={props.name} className="sr-only">
          {label}
        </label>
        {Icon && <Icon size={18} className="text-slate-500" />}
        <input
          {...props}
          className="w-full text-slate-700 placeholder:text-slate-500 font-ubuntu outline-none focus:outline-none focus-visible:ring-0 px-2 py-1"
        />
      </div>
      {error && (
        <span className="text-red-500 text-xs font-ubuntu">
          {error.message}
        </span>
      )}
    </>
  );
}
