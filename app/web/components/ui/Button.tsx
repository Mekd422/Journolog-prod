import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent/90 border border-accent",
  secondary:
    "bg-white text-text-primary border border-black/10 hover:bg-black/[0.02]",
  outline:
    "bg-transparent text-accent border border-accent hover:bg-accent/5",
  ghost: "bg-transparent text-text-body hover:bg-black/[0.04] border border-transparent",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[4px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
