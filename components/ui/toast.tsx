import * as React from "react"
import { Toaster as Sonner, toast as sonnerToast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        closeButton: true,
      }}
      {...props}
    />
  )
}

export { Toaster }

export const useToast = () => {
  return {
    toast: (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
      props.variant === 'destructive' 
        ? sonnerToast.error(props.title, { ...props })
        : sonnerToast(props.title, { ...props })
    },
  }
}

// Add this new export
export const ToasterProvider = Toaster