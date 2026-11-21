interface StatusMessageProps {
  type: 'error' | 'success' | 'info'
  children: string
}
export default function StatusMessage({ type, children }: StatusMessageProps) {
  return <div className={`notice notice-${type}`} role="status">{children}</div>
}
