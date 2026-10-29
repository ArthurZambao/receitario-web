import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="empty-state">
      <h1>Página não encontrada</h1>
      <p>O endereço que você acessou não existe neste receituário.</p>
      <Link to="/" className="btn">
        Voltar ao catálogo
      </Link>
    </section>
  )
}
