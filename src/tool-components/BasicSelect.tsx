import React from "react";

type Option = {
  value: string;
  label: string;
};

type BasicSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  helperText?: string;
  options: Option[];
};

function BasicSelect({ label, helperText, options, ...props }: BasicSelectProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-start !font-semibold">{label}</label>
      <select
        className="border-1 focus:bg-purple-main/5 border-grayish rounded-md cursor-pointer px-1 py-[0.5rem] focus:outline-2 focus:outline-purple-main outline-0"
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {helperText && <p className="text-xs text-secondary text-start">{helperText}</p>}
    </div>
  );
}

export default BasicSelect;
