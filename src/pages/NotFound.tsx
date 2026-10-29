import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="py-12">
      <h1 className="mb-2">Página não encontrada</h1>
      <p>O endereço que você acessou não existe neste receituário.</p>
      <Link
        to="/"
        className="mt-4 inline-flex items-center rounded-full bg-accent px-[1.1rem] py-[0.7rem] font-[650] text-white no-underline hover:bg-accent-dark"
      >
        Voltar ao catálogo
      </Link>
    </section>
  )
}
