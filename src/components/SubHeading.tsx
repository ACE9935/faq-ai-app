import { ReactNode } from "react";

type SubHeadingProps = {
  children: ReactNode;
};

function SubHeading({ children }: SubHeadingProps) {
  return <h2 className="text-lg text-secondary">{children}</h2>;
}

export default SubHeading;
