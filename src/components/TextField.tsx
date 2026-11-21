import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  id: string
}

export default function TextField({ label, error, id, className = '', ...props }: TextFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className={`control ${error ? 'control-error' : ''} ${className}`}
        aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  )
}
