import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ClubEvent } from '../types/event'
import { eventService } from '../services/eventService'
import { formatDate, isUpcoming } from '../utils/eventHelpers'
import Loading from '../components/Loading'
import StatusMessage from '../components/StatusMessage'

export default function EventListPage() {
  const [events, setEvents] = useState<ClubEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [keyword, setKeyword] = useState('')

  async function loadEvents() {
    setLoading(true); setError('')
    try { setEvents(await eventService.getAll()) }
    catch { setError('Không thể tải danh sách. Hãy kiểm tra json-server đang chạy tại cổng 3001.') }
    finally { setLoading(false) }
  }

  useEffect(() => { void loadEvents() }, [])

  const filtered = useMemo(() => events.filter(event =>
    event.name.toLocaleLowerCase('vi').includes(keyword.toLocaleLowerCase('vi'))
  ), [events, keyword])
  const upcoming = filtered.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date))
  const past = filtered.filter(event => !isUpcoming(event)).sort((a, b) => b.date.localeCompare(a.date))

  async function deleteEvent(event: ClubEvent) {
    if (!window.confirm(`Ông có chắc muốn xóa sự kiện "${event.name}" không?`)) return
    try {
      await eventService.remove(event.id)
      setEvents(current => current.filter(item => item.id !== event.id))
      setSuccess(`Đã xóa sự kiện "${event.name}" thành công.`)
      window.setTimeout(() => setSuccess(''), 3500)
    } catch { setError('Xóa sự kiện thất bại. Vui lòng thử lại.') }
  }

  function renderGroup(title: string, items: ClubEvent[]) {
    return (
      <section className="event-section">
        <div className="section-heading"><h2>{title}</h2><span className="count">{items.length}</span></div>
        {items.length === 0 ? <p className="empty-inline">Không có sự kiện trong nhóm này.</p> : (
          <div className="event-grid">
            {items.map(event => (
              <article className="event-card" key={event.id}>
                <div className="event-card-top">
                  <span className={`pill ${event.mode === 'online' ? 'pill-online' : 'pill-offline'}`}>
                    {event.mode === 'online' ? 'Trực tuyến' : 'Trực tiếp'}
                  </span>
                  <span className="event-date">{formatDate(event.date)}</span>
                </div>
                <h3><Link to={`/su-kien/${event.id}`}>{event.name}</Link></h3>
                <p className="muted">{event.startTime} – {event.endTime} · {event.mode === 'online' ? 'Online' : event.location}</p>
                <div className="card-bottom">
                  <span className="muted">♧ {event.maxSeats} chỗ</span>
                  <div className="card-actions">
                    <Link className="small-link" to={`/su-kien/${event.id}`}>Chi tiết</Link>
                    <button className="text-danger" onClick={() => void deleteEvent(event)}>Xóa</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    )
  }

  return (
    <div>
      <div className="page-heading">
        <div><p className="eyebrow">KHÔNG GIAN HOẠT ĐỘNG</p><h1>Sự kiện câu lạc bộ</h1>
          <p className="page-subtitle">Theo dõi, tổ chức và quản lý mọi hoạt động của câu lạc bộ.</p></div>
        <Link to="/su-kien/them" className="button button-primary">＋ Thêm sự kiện</Link>
      </div>
      <div className="toolbar"><input className="control search-input" aria-label="Tìm kiếm sự kiện"
        placeholder="Tìm theo tên sự kiện..." value={keyword} onChange={event => setKeyword(event.target.value)} />
        <span className="muted">{filtered.length} / {events.length} sự kiện</span></div>
      {success && <StatusMessage type="success">{success}</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      {loading ? <Loading /> : events.length === 0 ? <div className="empty-state"><div className="empty-icon">✦</div><h2>Chưa có sự kiện nào</h2><p>Bắt đầu bằng cách tạo sự kiện đầu tiên cho câu lạc bộ.</p><Link className="button button-primary" to="/su-kien/them">Thêm sự kiện</Link></div>
        : filtered.length === 0 ? <div className="empty-state"><h2>Không tìm thấy kết quả</h2><p>Thử một từ khóa khác nhé.</p></div>
        : <>{renderGroup('Sắp diễn ra', upcoming)}{renderGroup('Đã diễn ra', past)}</>}
    </div>
  )
}
