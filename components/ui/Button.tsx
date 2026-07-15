import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "solid" | "outline";
type Size = "md" | "sm";

const base = "transition-colors inline-flex items-center justify-center";

const styleMap: Record<`${Variant}-${Size}`, string> = {
  "solid-md":
    "rounded-full px-5 py-2 font-medium text-sm bg-[#4f6f58] text-[#f2f3f1] hover:bg-[#638b6d]",
  "outline-md":
    "rounded-full px-5 py-2 font-medium text-sm border border-[#4f6f58]/70 text-[#d6e4da] hover:bg-[#18251c]",
  "solid-sm":
    "rounded-md px-3 py-1.5 text-xs bg-[#4f6f58] text-[#f2f3f1] hover:bg-[#6a8a74]",
  "outline-sm":
    "rounded-md px-3 py-1.5 text-xs bg-[#1b261f] text-[#b8d9c2] border border-[#4f6f58]/40 hover:bg-[#24342a]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Button({
  variant = "solid",
  size = "md",
  className = "",
  children,
  href,
  ...rest
}: AsButton | AsAnchor) {
  const cls = `${base} ${styleMap[`${variant}-${size}`]} ${className}`.trim();

  if (href !== undefined) {
    return (
      <a
        href={href}
        className={cls}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
