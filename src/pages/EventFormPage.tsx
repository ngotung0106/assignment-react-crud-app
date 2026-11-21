import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EventForm from '../components/EventForm'
import StatusMessage from '../components/StatusMessage'
import { eventService } from '../services/eventService'
import type { EventFormValues } from '../types/event'

export default function EventCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(values: EventFormValues) {
    setSubmitting(true); setError('')
    try { await eventService.create(values); navigate('/', { state: { message: 'Thêm sự kiện thành công.' } }) }
    catch { setError('Không thể thêm sự kiện. Vui lòng kiểm tra kết nối API.') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="narrow-page">
      <Link to="/" className="back-link">← Quay lại danh sách</Link>
      <div className="page-heading compact"><div><p className="eyebrow">TẠO HOẠT ĐỘNG MỚI</p><h1>Thêm sự kiện</h1><p className="page-subtitle">Điền thông tin để tạo sự kiện cho câu lạc bộ.</p></div></div>
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      <EventForm isCreate submitting={submitting} submitLabel="Tạo sự kiện" onSubmit={handleCreate} />
    </div>
  )
}
