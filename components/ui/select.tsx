import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = ({ value, onValueChange, children }: any) => {
  return (
    <select
      className={cn(
        "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none",
      )}
      value={value}
      onChange={e => onValueChange(e.target.value)}
    >
      {children}
    </select>
  );
};

export const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border rounded-md px-3 py-2 bg-white cursor-pointer", className)} {...props} />
  )
);
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <span className="text-gray-500">{placeholder}</span>
);

export const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
);
