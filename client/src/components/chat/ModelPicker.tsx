import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MODELS, type ModelOption } from "@/lib/models";
import { cn } from "@/lib/utils";

interface ModelPickerProps {
  value: string;
  onChange: (modelId: string) => void;
}

const TIER_LABEL: Record<NonNullable<ModelOption["tier"]>, string> = {
  auto: "Auto",
  fast: "Fast",
  balanced: "Balanced",
  heavy: "Heavy",
};

export function ModelPicker({ value, onChange }: ModelPickerProps) {
  const current = MODELS.find((m) => m.id === value) ?? MODELS[0];

  // Group the curated list by tier so the dropdown can render a section per
  // tier (Fast / Balanced / Heavy) with a subtle divider in between.
  const grouped = groupByTier(MODELS);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <span className="text-xs text-muted-foreground font-normal">
            Model
          </span>
          <span className="font-medium">{current.label}</span>
          <span className="text-muted-foreground">▾</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[18rem]">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          OpenRouter model
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {grouped.map((group, idx) => (
          <Fragment key={group.tier ?? "untagged"}>
            {idx > 0 && <DropdownMenuSeparator />}
            {group.tier && (
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wide font-normal text-muted-foreground/70">
                {TIER_LABEL[group.tier]}
              </DropdownMenuLabel>
            )}
            {group.models.map((m) => (
              <DropdownMenuItem
                key={m.id}
                onSelect={() => onChange(m.id)}
                className={cn(
                  "cursor-pointer",
                  m.id === value &&
                    "font-medium text-brand-dark dark:text-brand"
                )}
              >
                <span className="w-3 text-brand-dark dark:text-brand">
                  {m.id === value ? "✓" : ""}
                </span>
                <span className="flex-1">{m.label}</span>
              </DropdownMenuItem>
            ))}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function groupByTier(
  models: ModelOption[]
): Array<{ tier: ModelOption["tier"]; models: ModelOption[] }> {
  const order: ModelOption["tier"][] = [
    "auto",
    "fast",
    "balanced",
    "heavy",
    undefined,
  ];
  const groups = new Map<ModelOption["tier"], ModelOption[]>();
  for (const m of models) {
    const bucket = groups.get(m.tier) ?? [];
    bucket.push(m);
    groups.set(m.tier, bucket);
  }
  return order
    .filter((t) => groups.has(t))
    .map((t) => ({
      tier: t,
      models: groups.get(t) as ModelOption[],
    }));
}
