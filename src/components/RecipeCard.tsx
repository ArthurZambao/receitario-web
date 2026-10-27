import { Link } from 'react-router-dom'
import { getTotalTimeMinutes, type Recipe } from '../types/recipe'

type RecipeCardProps = {
  recipe: Recipe
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

export function RecipeCard({
  recipe,
  isFavorite,
  onToggleFavorite,
}: RecipeCardProps) {
  const totalTime = getTotalTimeMinutes(recipe)

  return (
    <article className="recipe-card">
      <Link to={`/receitas/${recipe.id}`} className="recipe-card__link">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="recipe-card__image"
        />
        <div className="recipe-card__body">
          <h2 className="recipe-card__title">{recipe.name}</h2>
          <p className="recipe-card__meta">
            <span>{recipe.cuisine}</span>
            <span aria-hidden="true">·</span>
            <span>{totalTime} min</span>
          </p>
        </div>
      </Link>
      <button
        type="button"
        className={`favorite-btn${isFavorite ? ' is-active' : ''}`}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? `Remover ${recipe.name} dos favoritos`
            : `Favoritar ${recipe.name}`
        }
        onClick={() => onToggleFavorite(recipe.id)}
      >
        {isFavorite ? '♥ Favorita' : '♡ Favoritar'}
      </button>
    </article>
  )
}
