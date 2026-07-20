import { InputProps } from "@/@types";
import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon: Icon, label, error, name, ...props }, ref) => {
    return (
      <>
        <div className="flex flex-row items-center gap-1 px-2 py-1 border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-violet-900">
          <label htmlFor={name} className="sr-only">
            {label}
          </label>
          {Icon && <Icon size={18} className="text-slate-500" />}
          <input
            ref={ref}
            id={name}
            name={name}
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
  },
);

Input.displayName = "Input";
