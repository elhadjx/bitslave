import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "live" | "offline" | "deploying";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isLive = status === "live";
  const isDeploying = status === "deploying";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
        isLive
          ? "bg-[oklch(0.70_0.25_142.5_/_0.2)] text-[oklch(0.70_0.25_142.5)]"
          : isDeploying
            ? "bg-[oklch(0.75_0.18_80_/_0.2)] text-[oklch(0.75_0.18_80)]"
            : "bg-muted text-muted-foreground",
        className,
      )}
    >
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          isLive
            ? "bg-[oklch(0.70_0.25_142.5)] animate-pulse"
            : isDeploying
              ? "bg-[oklch(0.75_0.18_80)] animate-pulse"
              : "bg-muted-foreground",
        )}
      />
      <span>{isLive ? "Live" : isDeploying ? "Deploying" : "Offline"}</span>
    </div>
  );
}
