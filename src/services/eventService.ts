import api from './api'
import type { ClubEvent, EventFormValues } from '../types/event'

function toPayload(values: EventFormValues): Omit<ClubEvent, 'id'> {
  return {
    name: values.name.trim(),
    date: values.date,
    startTime: values.startTime,
    endTime: values.endTime,
    mode: values.mode,
    ...(values.mode === 'offline' ? { location: values.location.trim() } : { meetingUrl: values.meetingUrl.trim() }),
    maxSeats: Number(values.maxSeats),
    description: values.description.trim()
  }
}

export const eventService = {
  async getAll(): Promise<ClubEvent[]> {
    const response = await api.get<ClubEvent[]>('/events')
    return response.data
  },
  async getById(id: string): Promise<ClubEvent> {
    const response = await api.get<ClubEvent>(`/events/${id}`)
    return response.data
  },
  async create(values: EventFormValues): Promise<ClubEvent> {
    const response = await api.post<ClubEvent>('/events', toPayload(values))
    return response.data
  },
  async update(id: string, values: EventFormValues): Promise<ClubEvent> {
    const response = await api.put<ClubEvent>(`/events/${id}`, { id, ...toPayload(values) })
    return response.data
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/events/${id}`)
  }
}
