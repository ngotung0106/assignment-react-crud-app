import { Link } from 'react-router-dom'
export default function NotFoundPage() {
  return <div className="empty-state"><p className="eyebrow">404 · NOT FOUND</p><h1>Trang này không tồn tại</h1><p>Đường dẫn ông truy cập không hợp lệ hoặc đã bị thay đổi.</p><Link to="/" className="button button-primary">Về trang danh sách</Link></div>
}
