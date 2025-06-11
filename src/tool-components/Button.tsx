import { ReactNode, ElementType } from "react";
import { Loader } from "lucide-react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  variant ?: "primary" | "primary-2" | "primary-3" | "secondary" | "error" | "neutral" | "icon";
  Icon?: ElementType;  // Material Icons are React components typed as ElementType
};

function Button({ children, loading, Icon, variant="primary", ...props }: ButtonProps) {
  return (
    <button className={
    `${variant === "primary" ?
    "bg-main-gradient text-white":
    variant === "secondary" ?"hover:bg-grayish-dark bg-grayish text-black":
    variant === "error" ?"text-red-600 hover:bg-red-50 hover:text-white border hover:bg-red-500 border-red-500":
    variant === "primary-2" ?"bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white":
    variant === "primary-3" ?"bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white":
    variant === "neutral" ?"" :""} transition-all cursor-pointer flex items-center gap-2 p-2 px-4 font-semibold rounded-md flex justify-center gap-3`} {...props}>
      {(Icon && !loading) && <Icon size={20}/>}
      {loading && <Loader className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  );
}

export default Button;
