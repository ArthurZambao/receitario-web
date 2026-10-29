import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRecipeById } from '../api/recipes'
import { getTotalTimeMinutes, type Recipe } from '../types/recipe'

type DetailStatus = 'loading' | 'ready' | 'missing' | 'error'

const backLinkClass = 'inline-flex items-center font-[650] no-underline'
const btnClass =
  'mt-4 inline-flex items-center rounded-full bg-accent px-[1.1rem] py-[0.7rem] font-[650] text-white no-underline hover:bg-accent-dark'
const blockClass =
  'mb-[1.15rem] rounded-[10px] border border-line border-l-4 border-l-accent bg-surface px-[1.15rem] pt-4 pb-[0.35rem]'

export function RecipeDetail() {
  const { id } = useParams()
  return <RecipeDetailContent key={id} id={id} />
}

function RecipeDetailContent({ id }: { id: string | undefined }) {
  const recipeId = Number(id)
  const isValidId = Number.isInteger(recipeId) && recipeId > 0
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [status, setStatus] = useState<DetailStatus>(
    isValidId ? 'loading' : 'missing',
  )

  useEffect(() => {
    if (!isValidId) {
      return
    }

    let cancelled = false

    async function load() {
      try {
        const data = await getRecipeById(recipeId)
        if (cancelled) {
          return
        }

        if (data === null) {
          setStatus('missing')
          return
        }

        setRecipe(data)
        setStatus('ready')
      } catch {
        if (!cancelled) {
          setStatus('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [isValidId, recipeId])

  if (status === 'loading') {
    return <p className="py-12">Carregando receita...</p>
  }

  if (status === 'error') {
    return (
      <p className="py-12 text-favorite">
        Não foi possível carregar esta receita. Tente novamente em instantes.
      </p>
    )
  }

  if (status === 'missing' || recipe === null) {
    return (
      <section className="py-12">
        <h1 className="mb-2">Receita não encontrada</h1>
        <p>Não existe uma receita com o identificador informado.</p>
        <Link to="/" className={btnClass}>
          Voltar ao catálogo
        </Link>
      </section>
    )
  }

  const totalTime = getTotalTimeMinutes(recipe)

  return (
    <article>
      <Link to="/" className={backLinkClass}>
        ← Voltar ao catálogo
      </Link>

      <div className="my-5 grid grid-cols-1 items-center gap-6 min-[801px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="max-h-[380px] w-full rounded-[20px] object-cover"
        />
        <div>
          <p className="mb-1.5 text-[0.8rem] font-bold tracking-[0.08em] text-accent-dark uppercase">
            {recipe.cuisine}
          </p>
          <h1>{recipe.name}</h1>
          <ul className="mt-5 grid list-none grid-cols-1 gap-3 p-0 min-[801px]:grid-cols-3">
            <li className="flex flex-col gap-1 rounded-[14px] border border-line bg-surface p-[0.8rem]">
              <strong>Preparo</strong>
              <span>{recipe.prepTimeMinutes} min</span>
            </li>
            <li className="flex flex-col gap-1 rounded-[14px] border border-line bg-surface p-[0.8rem]">
              <strong>Cozimento</strong>
              <span>{recipe.cookTimeMinutes} min</span>
            </li>
            <li className="flex flex-col gap-1 rounded-[14px] border border-line bg-surface p-[0.8rem]">
              <strong>Total</strong>
              <span>{totalTime} min</span>
            </li>
          </ul>
        </div>
      </div>

      <section className={blockClass}>
        <h2 className="mb-[0.7rem] border-b border-line pb-[0.45rem] text-[1.15rem]">
          Ingredientes
        </h2>
        <ul className="mb-[0.7rem] list-none p-0">
          {recipe.ingredients.map((ingredient) => (
            <li
              key={ingredient}
              className="relative border-b border-line py-1.5 pr-0 pl-[1.15rem] last:border-b-0"
            >
              <span className="absolute left-0 font-bold text-accent">•</span>
              {ingredient}
            </li>
          ))}
        </ul>
      </section>

      <section className={blockClass}>
        <h2 className="mb-[0.7rem] border-b border-line pb-[0.45rem] text-[1.15rem]">
          Modo de preparo
        </h2>
        <ol className="mb-[0.7rem] list-none p-0">
          {recipe.instructions.map((step, index) => (
            <li
              key={`${index}-${step}`}
              className="flex items-start gap-[0.7rem] border-b border-line py-[0.55rem] last:border-b-0"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[0.8rem] font-bold text-accent-dark">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}
