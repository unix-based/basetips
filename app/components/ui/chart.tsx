"use client";

import * as React from "react";
import { cn } from "./utils";

// Stub implementation - chart not used in this project
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn("flex aspect-video justify-center", className)}
        {...props}
      >
        <div className="h-[400px] w-full">
          {children}
        </div>
      </div>
    </ChartContext.Provider>
  );
}

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-background p-2 shadow", className)}
    {...props}
  />
));
ChartTooltip.displayName = "ChartTooltip";

function ChartTooltipContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("min-w-[8rem] rounded-lg border px-2.5 py-1.5 text-xs shadow-xl", className)}
      {...props}
    />
  );
}

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center gap-4", className)}
    {...props}
  />
));
ChartLegend.displayName = "ChartLegend";

function ChartLegendContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-center gap-4", className)}
      {...props}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  return null; // Stub implementation
};

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};