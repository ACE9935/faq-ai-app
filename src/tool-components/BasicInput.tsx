type BasicInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: string;
  helperText?: string;
  onChange?: (value: string) => void;
};

function BasicInput({ label, helperText, onChange, ...props }: BasicInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-start font-semibold">{label}</label>
      <input
        className="border-1 border-grayish placeholder-secondary rounded-md px-2 py-[0.7rem] focus:bg-purple-main/5 focus:outline-2 focus:outline-purple-main outline-0"
        {...props}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {helperText && <p className="text-xs text-secondary text-start">{helperText}</p>}
    </div>
  );
}

export default BasicInput;
