import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-50 text-brand-700 ring-1 ring-brand-600/20",
        accent: "bg-accent-50 text-accent-600 ring-1 ring-accent-500/30",
        navy: "bg-navy-900 text-white",
        outline: "border border-slate-300 text-slate-600",
        success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
