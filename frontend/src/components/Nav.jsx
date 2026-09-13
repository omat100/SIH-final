import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="nav">
      <span className="nav-brand">Mine Subsidence Monitor</span>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Dashboard
        </NavLink>
        <NavLink to="/calibration" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Calibration
        </NavLink>
      </div>
    </nav>
  )
}
