type BasicTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  helperText?: string;
};

function BasicTextArea({ label, helperText, ...props }: BasicTextAreaProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-start">{label}</label>
      <textarea className="border-1 border-grayish placeholder-secondary focus:bg-purple-main/5 rounded-md min-h-[8rem] max-h-[15rem] px-2 py-[0.3rem] focus:outline-2 focus:outline-purple-main outline-0" {...props} />
      {helperText&&<p className="text-xs text-secondary text-start">{helperText}</p>}
    </div>
  );
}

export default BasicTextArea;
