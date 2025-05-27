import { ReactNode, ElementType } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant ?: "primary" | "secondary";
  Icon?: ElementType;  // Material Icons are React components typed as ElementType
};

function Button({ children, Icon, variant="primary", ...props }: ButtonProps) {
  return (
    <button className={`${variant === "primary" ?"bg-main-gradient text-white":"hover:bg-grayish-dark bg-grayish text-black"} transition-all cursor-pointer flex items-center gap-2 p-2 font-semibold rounded-md flex justify-center gap-3`} {...props}>
      {Icon && <Icon />} {/* Render icon if provided */}
      {children}
    </button>
  );
}

export default Button;
