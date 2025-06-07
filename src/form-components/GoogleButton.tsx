import { ReactNode, ElementType } from "react";

type GoogleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

function GoogleButton({ children, ...props }: GoogleButtonProps) {
  return (
    <button className={`bg-slate-100 transition-[background] border-1 hover:outline-2 hover:outline-purple-main hover:bg-grayish cursor-pointer flex items-center gap-2 p-2 font-semibold rounded-md flex justify-center gap-3`} {...props}>
       <img width={40} src="/google.png"/>
      {children}
    </button>
  );
}

export default GoogleButton;
