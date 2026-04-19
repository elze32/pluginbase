'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[--text-primary]">{label}</label>
        )}
        <select
          ref={ref}
          className={`
            h-9 px-3 rounded-[6px] text-sm
            bg-[--bg-sunken] text-[--text-primary]
            border border-[--border]
            focus:outline-none focus:border-[--border-focus] focus:ring-1 focus:ring-[--border-focus]
            transition-colors duration-150
            ${error ? 'border-[--status-doublon]' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[--status-doublon]">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
