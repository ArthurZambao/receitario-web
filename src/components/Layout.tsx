import { Link, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand">
            <span className="brand__mark" aria-hidden="true">
              🍴
            </span>
            Receitário
          </Link>
          <p className="brand-tagline">Catálogo de receitas do mundo todo</p>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>Checkpoint 5 · FIAP Frontend · DummyJSON</p>
      </footer>
    </div>
  )
}
