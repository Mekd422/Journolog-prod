import { cn } from "@/lib/utils";
import type { JourneyLogStatus } from "@/types";

const styles: Record<JourneyLogStatus, string> = {
  draft: "bg-black/5 text-text-body",
  private: "bg-primary/10 text-primary",
  public: "bg-accent/10 text-accent",
};

const labels: Record<JourneyLogStatus, string> = {
  draft: "Draft",
  private: "Private",
  public: "Public",
};

export function StatusBadge({
  status,
  className,
}: {
  status: JourneyLogStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
