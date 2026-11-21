import { NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="brand"><span className="brand-mark">✦</span> ClubEvent</NavLink>
          <nav className="main-nav" aria-label="Điều hướng chính">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Danh sách</NavLink>
            <NavLink to="/su-kien/them" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Thêm sự kiện</NavLink>
          </nav>
        </div>
      </header>
      <main className="main-content"><Outlet /></main>
      <footer className="site-footer">© 2026 ClubEvent · Quản lý hoạt động câu lạc bộ dễ dàng hơn.</footer>
    </div>
  )
}
