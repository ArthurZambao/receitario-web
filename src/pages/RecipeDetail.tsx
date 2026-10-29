import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRecipeById } from '../api/recipes'
import { getTotalTimeMinutes, type Recipe } from '../types/recipe'

type DetailStatus = 'loading' | 'ready' | 'missing' | 'error'

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
    return <p className="status-message">Carregando receita...</p>
  }

  if (status === 'error') {
    return (
      <p className="status-message status-message--error">
        Não foi possível carregar esta receita. Tente novamente em instantes.
      </p>
    )
  }

  if (status === 'missing' || recipe === null) {
    return (
      <section className="empty-state">
        <h1>Receita não encontrada</h1>
        <p>Não existe uma receita com o identificador informado.</p>
        <Link to="/" className="btn">
          Voltar ao catálogo
        </Link>
      </section>
    )
  }

  const totalTime = getTotalTimeMinutes(recipe)

  return (
    <article className="recipe-detail">
      <Link to="/" className="back-link">
        ← Voltar ao catálogo
      </Link>

      <div className="recipe-detail__hero">
        <img src={recipe.image} alt={recipe.name} />
        <div>
          <p className="recipe-detail__cuisine">{recipe.cuisine}</p>
          <h1>{recipe.name}</h1>
          <ul className="time-list">
            <li>
              <strong>Preparo</strong>
              <span>{recipe.prepTimeMinutes} min</span>
            </li>
            <li>
              <strong>Cozimento</strong>
              <span>{recipe.cookTimeMinutes} min</span>
            </li>
            <li>
              <strong>Total</strong>
              <span>{totalTime} min</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="recipe-block">
        <h2>Ingredientes</h2>
        <ul className="ingredient-list">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
      </section>

      <section className="recipe-block">
        <h2>Modo de preparo</h2>
        <ol className="instruction-list">
          {recipe.instructions.map((step, index) => (
            <li key={`${index}-${step}`}>{step}</li>
          ))}
        </ol>
      </section>
    </article>
  )
}
