export type EventMode = 'offline' | 'online'

export interface ClubEvent {
  id: string
  name: string
  date: string
  startTime: string
  endTime: string
  mode: EventMode
  location?: string
  meetingUrl?: string
  maxSeats: number
  description: string
}

export interface EventFormValues {
  name: string
  date: string
  startTime: string
  endTime: string
  mode: EventMode
  location: string
  meetingUrl: string
  maxSeats: string
  description: string
}

export interface FormErrors {
  name?: string
  date?: string
  startTime?: string
  endTime?: string
  mode?: string
  location?: string
  meetingUrl?: string
  maxSeats?: string
}

export interface FieldErrorProps {
  error?: string
}
