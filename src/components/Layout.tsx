import { Link, Outlet } from 'react-router-dom'

const shellWidth = 'mx-auto w-[calc(100%-2rem)] max-w-[1120px]'

export function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="mb-5 border-b-[3px] border-accent bg-surface">
        <div
          className={`${shellWidth} flex flex-wrap items-baseline gap-x-4 gap-y-1 py-[1.1rem] pb-[0.95rem]`}
        >
          <Link
            to="/"
            className="font-display inline-flex items-center gap-1.5 text-[1.85rem] font-bold tracking-[0.02em] text-heading no-underline"
          >
            <span className="text-[1.2rem]" aria-hidden="true">
              🍴
            </span>
            Receitário
          </Link>
          <p className="text-[0.92rem] text-muted italic">
            Catálogo de receitas do mundo todo
          </p>
        </div>
      </header>

      <main className={`${shellWidth} flex-1 pb-12`}>
        <Outlet />
      </main>

      <footer
        className={`${shellWidth} border-t border-line py-5 pb-8 text-[0.9rem] text-muted`}
      >
        <p>Checkpoint 5 · FIAP Frontend · DummyJSON</p>
      </footer>
    </div>
  )
}
