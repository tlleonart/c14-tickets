import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/modules/shared/lib/utils";
import { Button } from "@/modules/shared/components/ui/button";

// Error State Component
interface ErrorStateProps {
  title?: string;
  description?: string;
  retry?: () => void;
  className?: string;
  variant?: "default" | "minimal" | "inline";
}

export function ErrorState({
  title = "Algo salió mal",
  description = "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.",
  retry,
  className,
  variant = "default",
}: ErrorStateProps) {
  if (variant === "minimal") {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-sm text-muted-foreground mb-4">{title}</p>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20",
          className
        )}
      >
        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive">{title}</p>
          {description && (
            <p className="text-xs text-destructive/80 mt-1">{description}</p>
          )}
        </div>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-md">{description}</p>
      </div>
      {retry && (
        <Button onClick={retry} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Intentar de nuevo
        </Button>
      )}
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground max-w-md">{description}</p>
        )}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
