"use client";

import * as React from "react";
import { cn } from "./utils";

// Stub implementation - drawer not used in this project
function Drawer({ children, ...props }: React.ComponentProps<"div">) {
  return <div {...props}>{children}</div>;
}

function DrawerTrigger({ children, ...props }: React.ComponentProps<"button">) {
  return <button {...props}>{children}</button>;
}

function DrawerPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DrawerClose({ children, ...props }: React.ComponentProps<"button">) {
  return <button {...props}>{children}</button>;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm", className)}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
          className
        )}
        {...props}
      >
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {children}
      </div>
    </DrawerPortal>
  );
}

function DrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DrawerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};