import type { ClubEvent, EventFormValues } from '../types/event'

export const emptyEventForm: EventFormValues = {
  name: '', date: '', startTime: '', endTime: '', mode: 'offline',
  location: '', meetingUrl: '', maxSeats: '', description: ''
}

export function eventToForm(event: ClubEvent): EventFormValues {
  return {
    name: event.name, date: event.date, startTime: event.startTime, endTime: event.endTime,
    mode: event.mode, location: event.location ?? '', meetingUrl: event.meetingUrl ?? '',
    maxSeats: String(event.maxSeats), description: event.description ?? ''
  }
}

export function isUpcoming(event: ClubEvent): boolean {
  const today = new Date()
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return new Date(`${event.date}T00:00:00`) >= localToday
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}
