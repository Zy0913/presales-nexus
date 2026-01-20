"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, min = 0, max = 100, step = 1, value, defaultValue, onValueChange, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState(defaultValue || [0])
    const currentValue = value || localValue
    const percentage = Math.min(Math.max(((currentValue[0] - min) / (max - min)) * 100, 0), 100)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [parseFloat(e.target.value)]
      setLocalValue(newValue)
      onValueChange?.(newValue)
    }

    return (
      <div
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center h-5", className)}
        {...props}
      >
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue[0]}
          onChange={handleInputChange}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-zinc-100 pointer-events-none">
          <div
            className="absolute h-full bg-zinc-900 transition-all duration-75 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2 block h-4 w-4 rounded-full border border-zinc-200 bg-white ring-offset-white transition-all shadow-sm pointer-events-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
