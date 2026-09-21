import { createElement, type ElementType, type ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export function Container({ children, as = "div", className = "" }: ContainerProps) {
  return createElement(as, { className: `container-editorial ${className}` }, children);
}
