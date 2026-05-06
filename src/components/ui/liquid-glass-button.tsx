"use client"

import * as React from "react"
import * as SlotPrimitive from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const liquidbuttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-visible group",
  {
    variants: {
      variant: {
        default: "bg-transparent text-secondary hover:text-primary",
        primary: "bg-transparent text-white",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 text-base",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
)

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidbuttonVariants> {
  asChild?: boolean
}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? SlotPrimitive.Slot : "button"
    
    // Mouse tracking for liquid effect
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 20, stiffness: 300 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Calculate relative position from center (-1 to 1)
      const relX = (e.clientX - centerX) / (rect.width / 2)
      const relY = (e.clientY - centerY) / (rect.height / 2)
      
      mouseX.set(relX * 8) // Reduced displacement for more subtle effect
      mouseY.set(relY * 8)
    }

    const handleMouseLeave = () => {
      mouseX.set(0)
      mouseY.set(0)
    }

    return (
      <motion.div 
        className={cn("relative inline-flex items-center justify-center group", className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ 
          scale: 1.05, 
          y: -1,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 z-20 overflow-hidden rounded-full pointer-events-none">
          <motion.div
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
          />
        </div>

        {/* 3D Liquid Glass Pill Background */}
        <motion.div 
          style={{ x, y }}
          className={cn(
            "absolute inset-0 z-0 rounded-full transition-all duration-300",
            variant === 'primary' 
              ? "bg-primary shadow-[0_4px_12px_rgba(217,79,4,0.4),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.2)]" 
              : "shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.1)] border border-white/20",
            "group-hover:shadow-[0_4px_15px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.2)]",
            variant === 'primary' && "group-hover:bg-primary-hover group-hover:shadow-[0_8px_25px_rgba(217,79,4,0.5),inset_0_1px_2px_rgba(255,255,255,0.5)]"
          )}
        />
        
        {/* Glass Reflection Layer */}
        <div
          className={cn(
            "absolute inset-0 -z-10 isolate overflow-hidden rounded-full transition-opacity duration-500",
            variant === 'primary' ? "opacity-20" : "opacity-30 group-hover:opacity-50"
          )}
          style={{ backdropFilter: variant === 'primary' ? 'none' : 'blur(4px)' }}
        />

        {/* Inner Glow */}
        <div className="absolute inset-0 -z-5 bg-white/10 rounded-full blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <Comp
          className={cn(liquidbuttonVariants({ variant, size, className: "" }), "z-10")}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      </motion.div>
    )
  }
)
LiquidButton.displayName = "LiquidButton"

export { LiquidButton, liquidbuttonVariants }
