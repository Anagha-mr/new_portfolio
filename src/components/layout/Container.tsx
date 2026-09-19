import { createElement, type ElementType, type ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

/** Consistent max-width + gutter wrapper. The 12-column grid lives inside this. */
export function Container({ children, as = "div", className = "" }: ContainerProps) {
  return createElement(as, { className: `container-editorial ${className}` }, children);
}
