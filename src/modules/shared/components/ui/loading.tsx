/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/modules/shared/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Loading Spinner Component
const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-4 w-4",
      default: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function LoadingSpinner({ size, className }: LoadingSpinnerProps) {
  return <Loader2 className={cn(spinnerVariants({ size }), className)} />;
}

// Skeleton Components
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("skeleton", className)} {...props} />;
}

// Event Card Skeleton
export function EventCardSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border p-4 bg-card">
      <Skeleton className="h-48 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

// Page Loading Component
interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({
  message = "Cargando...",
  className,
}: PageLoadingProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center space-y-4",
        className
      )}
    >
      <LoadingSpinner size="xl" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

// Button Loading State
interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({
  loading = false,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      className={cn("inline-flex items-center justify-center gap-2", className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}
