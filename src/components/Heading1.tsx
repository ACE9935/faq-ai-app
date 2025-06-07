import { ReactNode } from "react";

type Heading1Props = {
  children: ReactNode;
};

function Heading1({ children }: Heading1Props) {
  return <h1 className="text-4xl text-center font-bold bg-gradient-to-r from-purple-main to-purple-secondary text-transparent bg-clip-text">{children}</h1>;
}

export default Heading1;
