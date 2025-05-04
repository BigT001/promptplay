"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type DropdownMenuContextType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined)

function useDropdownMenu() {
  const context = useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("Dropdown components must be used within a DropdownMenu")
  }
  return context
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return <DropdownMenuContext.Provider value={{ open, setOpen }}>{children}</DropdownMenuContext.Provider>
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ className, asChild = false, onClick, children, ...props }, ref) => {
    const { open, setOpen } = useDropdownMenu()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(!open)
      onClick?.(e)
    }

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement
      return React.cloneElement(child, {
        onClick: handleClick,
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        'data-state': open ? 'open' : 'closed',
        className: cn(child.props.className, className),
        ref: (node: HTMLButtonElement) => {
          // Handle both function refs and ref objects
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
          
          // Forward the ref to the original child if it has one
          const childRef = child.ref
          if (typeof childRef === 'function') childRef(node)
          else if (childRef) (childRef as React.MutableRefObject<HTMLButtonElement>).current = node
        },
        ...props
      })
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        data-state={open ? "open" : "closed"}
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "center" | "end"
    sideOffset?: number
  }
>(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
  const { open, setOpen } = useDropdownMenu()
  const contentRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick)
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        {
          "animate-in fade-in-80": open,
        },
        className,
      )}
      style={{
        position: "absolute",
        top: `calc(100% + ${sideOffset}px)`,
        ...(align === "start"
          ? { left: 0 }
          : align === "end"
            ? { right: 0 }
            : { left: "50%", transform: "translateX(-50%)" }),
      }}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { setOpen } = useDropdownMenu()

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      props.onClick?.(e)
      setOpen(false)
    }

    return (
      <div
        ref={ref}
        role="menuitem"
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className,
        )}
        onClick={handleClick}
        {...props}
      />
    )
  },
)
DropdownMenuItem.displayName = "DropdownMenuItem"

export const DropdownMenuGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1 p-1", className)} role="group" {...props} />
  ),
)
DropdownMenuGroup.displayName = "DropdownMenuGroup"

export const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />,
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)} {...props} />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"
