import { Link, NavLink } from "react-router-dom"

function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">LC</span>
          <span>
            <strong>Loja do Campus</strong>
            <small>Materiais e utilidades</small>
          </span>
        </Link>

        <nav className="nav">
          <NavLink to="/" end>
            Catálogo
          </NavLink>
          <NavLink to="/novo">Adicionar</NavLink>
        </nav>
      </header>

      <main className="content">{children}</main>
    </div>
  )
}

export default Layout
