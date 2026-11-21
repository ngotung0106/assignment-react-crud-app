import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import StatusMessage from '../components/StatusMessage'
import { eventService } from '../services/eventService'
import type { ClubEvent } from '../types/event'
import { formatDate } from '../utils/eventHelpers'

export default function EventDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState<ClubEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    eventService.getById(id).then(data => { if (active) setEvent(data) })
      .catch(() => { if (active) setError('Không tìm thấy sự kiện hoặc API không phản hồi.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  async function handleDelete() {
    if (!event || !window.confirm(`Ông có chắc muốn xóa sự kiện "${event.name}" không?`)) return
    try { await eventService.remove(event.id); navigate('/', { state: { message: 'Xóa sự kiện thành công.' } }) }
    catch { setError('Xóa sự kiện thất bại. Vui lòng thử lại.') }
  }

  if (loading) return <Loading />
  if (error || !event) return <div className="empty-state"><StatusMessage type="error">{error || 'Không tìm thấy sự kiện.'}</StatusMessage><Link className="button button-secondary" to="/">Về danh sách</Link></div>

  return (
    <div className="narrow-page">
      <Link to="/" className="back-link">← Quay lại danh sách</Link>
      <div className="detail-card">
        <div className="detail-top"><span className={`pill ${event.mode === 'online' ? 'pill-online' : 'pill-offline'}`}>{event.mode === 'online' ? 'Trực tuyến' : 'Trực tiếp'}</span><span className="event-date">{formatDate(event.date)}</span></div>
        <h1>{event.name}</h1>
        <p className="detail-description">{event.description || 'Chưa có mô tả cho sự kiện này.'}</p>
        <div className="detail-list">
          <div><span>Ngày tổ chức</span><strong>{formatDate(event.date)}</strong></div>
          <div><span>Thời gian</span><strong>{event.startTime} – {event.endTime}</strong></div>
          <div><span>Hình thức</span><strong>{event.mode === 'online' ? 'Trực tuyến' : 'Trực tiếp'}</strong></div>
          <div><span>{event.mode === 'online' ? 'Đường dẫn tham gia' : 'Địa điểm'}</span><strong>{event.mode === 'online' ? <a href={event.meetingUrl} target="_blank" rel="noreferrer">{event.meetingUrl}</a> : event.location}</strong></div>
          <div><span>Số chỗ tối đa</span><strong>{event.maxSeats} người</strong></div>
        </div>
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        <div className="detail-actions"><Link className="button button-primary" to={`/su-kien/${event.id}/sua`}>Chỉnh sửa</Link><button className="button button-danger" onClick={() => void handleDelete()}>Xóa sự kiện</button></div>
      </div>
    </div>
  )
}
