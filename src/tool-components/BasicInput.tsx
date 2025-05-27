type BasicInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
};

function BasicInput({ label,helperText, ...props }: BasicInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-start">{label}</label>
      <input type="text" className="border-1 border-grayish placeholder-secondary rounded-md px-2 py-[0.3rem] focus:bg-purple-main/5 focus:outline-2 focus:outline-purple-main outline-0" {...props} />
      {helperText&&<p className="text-xs text-secondary text-start">{helperText}</p>}
    </div>
  );
}

export default BasicInput;
