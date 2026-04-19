'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[--text-primary]">{label}</label>
        )}
        <input
          ref={ref}
          className={`
            h-9 px-3 rounded-[6px] text-sm
            bg-[--bg-sunken] text-[--text-primary]
            border border-[--border]
            placeholder:text-[--text-muted]
            focus:outline-none focus:border-[--border-focus] focus:ring-1 focus:ring-[--border-focus]
            transition-colors duration-150
            ${error ? 'border-[--status-doublon]' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-[--status-doublon]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
