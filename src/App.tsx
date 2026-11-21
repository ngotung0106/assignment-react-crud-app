import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import EventListPage from './pages/EventListPage'
import EventCreatePage from './pages/EventFormPage'
import EventDetailPage from './pages/EventDetailPage'
import EventEditPage from './pages/EventEditPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<EventListPage />} />
        <Route path="/su-kien/them" element={<EventCreatePage />} />
        <Route path="/su-kien/:id/sua" element={<EventEditPage />} />
        <Route path="/su-kien/:id" element={<EventDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
