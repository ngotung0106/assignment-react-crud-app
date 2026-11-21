interface LoadingProps { label?: string }
export default function Loading({ label = 'Đang tải dữ liệu...' }: LoadingProps) {
  return <div className="state-box"><span className="spinner" />{label}</div>
}
