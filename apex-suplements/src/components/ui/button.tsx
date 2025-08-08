import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary Apex Red gradient
        default: "bg-gradient-to-r from-apex-red to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",

        // Performance gradient (blue to red)
        performance: "bg-gradient-to-r from-performance-blue to-apex-red text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",

        // Gold accent for premium products
        premium: "bg-gradient-to-r from-apex-gold to-yellow-500 text-black shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] font-semibold",

        // Destructive for dangerous actions
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md",

        // Outline variant with brand colors
        outline: "border-2 border-apex-red text-apex-red bg-transparent hover:bg-apex-red hover:text-white shadow-sm",

        // Secondary variant
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm",

        // Ghost for subtle actions
        ghost: "hover:bg-gray-100 hover:text-gray-900",

        // Link style
        link: "text-apex-red underline-offset-4 hover:underline",

        // Glass morphism variant
        glass: "glass text-gray-900 hover:bg-white/40 border border-white/20 backdrop-blur-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }