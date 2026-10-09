import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-[var(--duration-fast)]";

const variants: Record<Variant, string> = {
  primary:
    "border border-cobalt px-5 py-3 text-ivory hover:border-deep-cobalt hover:bg-deep-cobalt focus-visible:bg-deep-cobalt active:border-deep-cobalt active:bg-deep-cobalt/80",
  ghost: "text-stone hover:text-ivory focus-visible:text-ivory active:text-silver",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type LinkButtonProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
