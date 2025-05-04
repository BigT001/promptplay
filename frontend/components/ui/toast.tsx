"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// Types
export type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
  onClose?: () => void
}

type ToastContextType = {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id">) => string
  removeToast: (id: string) => void
  updateToast: (id: string, toast: Partial<ToastProps>) => void
}

// Context
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Provider
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, ...toast }
    setToasts((prev) => [...prev, newToast])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const updateToast = (id: string, toast: Partial<ToastProps>) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...toast } : t)))
  }

  // Auto-remove toasts after their duration
  useEffect(() => {
    const timers = toasts
      .map((toast) => {
        if (toast.duration !== Number.POSITIVE_INFINITY) {
          const timer = setTimeout(() => {
            removeToast(toast.id)
          }, toast.duration || 5000)
          return { id: toast.id, timer }
        }
        return null
      })
      .filter(Boolean) as { id: string; timer: NodeJS.Timeout }[]

    return () => {
      timers.forEach(({ timer }) => clearTimeout(timer))
    }
  }, [toasts])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>{children}</ToastContext.Provider>
  )
}

// Hook
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return {
    toast: (props: Omit<ToastProps, "id">) => context.addToast(props),
    dismiss: (id: string) => context.removeToast(id),
    update: (id: string, props: Partial<ToastProps>) => context.updateToast(id, props),
  }
}

// Components
export const Toast = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & ToastProps>(
  ({ className, id, title, description, action, variant = "default", onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
          {
            "bg-background text-foreground": variant === "default",
            "bg-red-600 text-white border-red-600": variant === "destructive",
          },
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {action}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    )
  },
)
Toast.displayName = "Toast"

export const Toaster = () => {
  const { toasts, removeToast } = useContext(ToastContext) || { toasts: [], removeToast: () => {} }

  if (!toasts.length) return null

  return (
    <div className="fixed top-0 z-[100] flex flex-col gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col-reverse md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          action={toast.action}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}
