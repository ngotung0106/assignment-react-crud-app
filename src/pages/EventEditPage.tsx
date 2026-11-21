import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EventForm from '../components/EventForm'
import Loading from '../components/Loading'
import StatusMessage from '../components/StatusMessage'
import { eventService } from '../services/eventService'
import type { ClubEvent, EventFormValues } from '../types/event'
import { eventToForm } from '../utils/eventHelpers'

export default function EventEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState<ClubEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    eventService.getById(id).then(data => { if (active) setEvent(data) })
      .catch(() => { if (active) setError('Không tìm thấy sự kiện cần chỉnh sửa.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  async function handleUpdate(values: EventFormValues) {
    setSubmitting(true); setError('')
    try { await eventService.update(id, values); navigate(`/su-kien/${id}`) }
    catch { setError('Cập nhật thất bại. Vui lòng kiểm tra kết nối API.') }
    finally { setSubmitting(false) }
  }

  if (loading) return <Loading />
  if (!event) return <div className="empty-state"><StatusMessage type="error">{error || 'Không tìm thấy sự kiện.'}</StatusMessage><Link to="/" className="button button-secondary">Về danh sách</Link></div>

  return (
    <div className="narrow-page">
      <Link to={`/su-kien/${id}`} className="back-link">← Quay lại chi tiết</Link>
      <div className="page-heading compact"><div><p className="eyebrow">CẬP NHẬT THÔNG TIN</p><h1>Chỉnh sửa sự kiện</h1><p className="page-subtitle">Thay đổi thông tin cho “{event.name}”.</p></div></div>
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      <EventForm key={event.id} initialValues={eventToForm(event)} isCreate={false}
        submitting={submitting} submitLabel="Lưu thay đổi" onSubmit={handleUpdate} />
    </div>
  )
}
