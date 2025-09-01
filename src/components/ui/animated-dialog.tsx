"use client"

// Uses a single animation layer to avoid jank (no double animations).
// Overlay blur is optional (off by default for performance).

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from 'lucide-react'
import { motion, AnimatePresence, type Transition } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimatedDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function AnimatedDialog({ open, onOpenChange, children }: AnimatedDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  )
}

export const AnimatedDialogTrigger = DialogPrimitive.Trigger

type AnimatedDialogContentProps = React.ComponentPropsWithoutRef<"div"> & {
  blurOverlay?: boolean
  forceMount?: boolean
  duration?: number
  // NEW: where the scale should start when opening (e.g., 0.8 => 80%)
  scaleFrom?: number
  // NEW: easing function/curve for the content transition
  ease?: Transition["ease"]
}

export function AnimatedDialogContent({
  className,
  children,
  blurOverlay = false,
  forceMount,
  // defaults tuned to your requested animation style
  duration = 0.5,
  scaleFrom = 0.8,
  ease = "easeInOut",
  ...props
}: AnimatedDialogContentProps) {
  return (
    <DialogPrimitive.Portal forceMount={forceMount || undefined}>
      <AnimatePresence>
        <DialogPrimitive.Overlay asChild forceMount>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            className={cn("fixed inset-0 z-50 bg-black/50", blurOverlay && "backdrop-blur-[2px]")}
          />
        </DialogPrimitive.Overlay>

        <DialogPrimitive.Content asChild forceMount>
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: scaleFrom }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: scaleFrom }}
            transition={{ duration, ease }}
            className={cn(
              "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
              "gap-4 rounded-lg border bg-background p-6 shadow-lg outline-none",
              className,
            )}
            {...props}
          >
            {children}
            <DialogPrimitive.Close
              className={cn(
                "absolute right-3 top-3 rounded-sm opacity-70 transition-opacity",
                "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
              )}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </motion.div>
        </DialogPrimitive.Content>
      </AnimatePresence>
    </DialogPrimitive.Portal>
  )
}

export const AnimatedDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)

export const AnimatedDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)

export const AnimatedDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AnimatedDialogTitle.displayName = DialogPrimitive.Title.displayName

export const AnimatedDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
AnimatedDialogDescription.displayName = DialogPrimitive.Description.displayName
