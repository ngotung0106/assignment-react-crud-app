import type { EventFormValues, FormErrors } from '../types/event'

export function validateEvent(values: EventFormValues, isCreate: boolean): FormErrors {
  const errors: FormErrors = {}
  const name = values.name.trim()

  if (!name) errors.name = 'Vui lòng nhập tên sự kiện.'
  else if (name.length < 5 || name.length > 100) errors.name = 'Tên sự kiện phải từ 5 đến 100 ký tự.'

  if (!values.date) errors.date = 'Vui lòng chọn ngày tổ chức.'
  else if (isCreate) {
    const today = new Date()
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const selected = new Date(`${values.date}T00:00:00`)
    if (selected < localToday) errors.date = 'Ngày tổ chức khi thêm mới không được ở quá khứ.'
  }

  if (!values.startTime) errors.startTime = 'Vui lòng chọn giờ bắt đầu.'
  if (!values.endTime) errors.endTime = 'Vui lòng chọn giờ kết thúc.'
  else if (values.startTime && values.endTime <= values.startTime) errors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu.'

  if (values.mode === 'offline' && !values.location.trim()) {
    errors.location = 'Vui lòng nhập địa điểm tổ chức.'
  }
  if (values.mode === 'online') {
    if (!values.meetingUrl.trim()) errors.meetingUrl = 'Vui lòng nhập đường dẫn tham gia.'
    else {
      try {
        const url = new URL(values.meetingUrl)
        if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Invalid protocol')
      } catch {
        errors.meetingUrl = 'Đường dẫn phải đúng định dạng URL (http hoặc https).'
      }
    }
  }

  if (!values.maxSeats.trim()) errors.maxSeats = 'Vui lòng nhập số chỗ tối đa.'
  else {
    const seats = Number(values.maxSeats)
    if (!Number.isInteger(seats)) errors.maxSeats = 'Số chỗ tối đa phải là số nguyên.'
    else if (seats < 1 || seats > 500) errors.maxSeats = 'Số chỗ tối đa phải từ 1 đến 500.'
  }

  return errors
}
