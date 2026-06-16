"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // backdrop-blur-sm removed: it forces the GPU to re-composite the entire
      // page on every animation frame and was the primary cause of open/close lag.
      "fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-150",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full max-w-lg",
        "translate-x-[-50%] translate-y-[-50%]",
        "border shadow-2xl rounded-2xl",
        // Simplified animation: fade + zoom only.
        // The original had three simultaneous transforms (fade + zoom + two-axis slide)
        // which caused composite-layer thrashing. Fade + zoom is smoother.
        "duration-150",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        // Flex-column layout with scroll: header stays on top (sticky), body scrolls.
        // max-h-[90vh] prevents dialogs from overflowing the viewport.
        // overflow-y-auto enables scroll when content is taller than the dialog.
        "flex flex-col max-h-[90vh] overflow-y-auto",
        // p-6 kept for backward compat — DialogHeader's -mx-6 -mt-6 relies on it.
        "p-6",
        className
      )}
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className="absolute right-4 top-4 z-20 flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:opacity-80 focus:outline-none focus:ring-2"
        style={{ background: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}
        aria-label="Close dialog"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-1 -mx-6 -mt-6 px-6 pt-6 pb-4 mb-2 border-b shrink-0",
      // sticky top-[-1.5rem] cancels the -mt-6 offset (p-6 = 1.5rem) so the header
      // visually pins to the top of the dialog while the form body scrolls below.
      "sticky top-[-1.5rem] z-10",
      className
    )}
    style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

// DialogBody — wrap the form fields in this to get a scrollable middle section.
// The -mx-6 px-6 removes and re-applies horizontal padding so scrollbar sits at edge.
const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex-1 overflow-y-auto -mx-6 px-6 pb-2", className)}
    {...props}
  />
)
DialogBody.displayName = "DialogBody"

// DialogFooter — pin action buttons to the bottom above the dialog's p-6 padding.
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
