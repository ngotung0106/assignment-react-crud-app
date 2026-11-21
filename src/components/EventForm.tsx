import { useEffect, useState } from 'react'
import type { ChangeEvent, FocusEvent, FormEvent } from 'react'
import type { EventFormValues, FormErrors } from '../types/event'
import { emptyEventForm } from '../utils/eventHelpers'
import { validateEvent } from '../utils/validateEvent'
import TextField from './TextField'

interface EventFormProps {
  initialValues?: EventFormValues
  isCreate: boolean
  submitting: boolean
  submitLabel: string
  onSubmit: (values: EventFormValues) => Promise<void>
}

export default function EventForm({ initialValues, isCreate, submitting, submitLabel, onSubmit }: EventFormProps) {
  const [values, setValues] = useState<EventFormValues>(initialValues ?? emptyEventForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setValues(initialValues ?? emptyEventForm)
  }, [initialValues])

  function update<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
    const next = { ...values, [key]: value }
    setValues(next)
    if (touched[key]) setErrors(validateEvent(next, isCreate))
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target
    if (name in values) update(name as keyof EventFormValues, value as never)
  }

  function handleBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const key = event.target.name
    setTouched(previous => ({ ...previous, [key]: true }))
    setErrors(validateEvent(values, isCreate))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateEvent(values, isCreate)
    setErrors(nextErrors)
    setTouched(Object.keys(values).reduce<Record<string, boolean>>((result, key) => {
      result[key] = true
      return result
    }, {}))
    if (Object.keys(nextErrors).length > 0) return
    await onSubmit(values)
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <TextField id="name" name="name" label="Tên sự kiện *" value={values.name}
          onChange={handleChange} onBlur={handleBlur} error={errors.name} placeholder="Ví dụ: Workshop kỹ năng mềm" maxLength={100} />
        <TextField id="date" name="date" type="date" label="Ngày tổ chức *" value={values.date}
          onChange={handleChange} onBlur={handleBlur} error={errors.date} />
        <TextField id="startTime" name="startTime" type="time" label="Giờ bắt đầu *" value={values.startTime}
          onChange={handleChange} onBlur={handleBlur} error={errors.startTime} />
        <TextField id="endTime" name="endTime" type="time" label="Giờ kết thúc *" value={values.endTime}
          onChange={handleChange} onBlur={handleBlur} error={errors.endTime} />
        <div className="field">
          <label htmlFor="mode">Hình thức *</label>
          <select id="mode" name="mode" className="control" value={values.mode}
            onChange={(event) => update('mode', event.target.value as EventFormValues['mode'])}
            onBlur={handleBlur}>
            <option value="offline">Trực tiếp</option>
            <option value="online">Trực tuyến</option>
          </select>
        </div>
        {values.mode === 'offline' ? (
          <TextField id="location" name="location" label="Địa điểm *" value={values.location}
            onChange={handleChange} onBlur={handleBlur} error={errors.location} placeholder="Nhập địa điểm tổ chức" />
        ) : (
          <TextField id="meetingUrl" name="meetingUrl" type="url" label="Đường dẫn tham gia *" value={values.meetingUrl}
            onChange={handleChange} onBlur={handleBlur} error={errors.meetingUrl} placeholder="https://..." />
        )}
        <TextField id="maxSeats" name="maxSeats" type="number" min="1" max="500" step="1"
          label="Số chỗ tối đa *" value={values.maxSeats} onChange={handleChange}
          onBlur={handleBlur} error={errors.maxSeats} placeholder="Tối đa 500" />
        <div className="field full-width">
          <label htmlFor="description">Mô tả sự kiện</label>
          <textarea id="description" name="description" className="control textarea"
            value={values.description} onChange={handleChange} onBlur={handleBlur}
            placeholder="Giới thiệu ngắn về sự kiện..." rows={4} />
        </div>
      </div>
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? 'Đang lưu...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
