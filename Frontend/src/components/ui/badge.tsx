import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
        mock: "bg-slate-700/60 text-slate-400 border border-slate-600/40",
        live: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
        strength: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
        weakness: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
        opportunity: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
        threat: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
        critical: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
        high: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
        medium: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
        low: "bg-slate-500/15 text-slate-400 border border-slate-500/20",
        new: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
        board: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
        department: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
        committee: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
