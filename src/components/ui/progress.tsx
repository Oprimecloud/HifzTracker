import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-white/5", // Match your dark background
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-emerald-600 transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(16,185,129,0.3)]" // Added emerald glow
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }