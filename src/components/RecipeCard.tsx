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
    <article className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface shadow-card">
      <Link
        to={`/receitas/${recipe.id}`}
        className="text-inherit no-underline"
      >
        <img
          src={recipe.image}
          alt={recipe.name}
          className="h-[180px] w-full object-cover"
        />
        <div className="px-4 pt-[0.9rem] pb-[0.3rem]">
          <h2 className="mb-1.5 text-[1.05rem]">{recipe.name}</h2>
          <p className="flex gap-1.5 text-[0.9rem] text-muted">
            <span>{recipe.cuisine}</span>
            <span aria-hidden="true">·</span>
            <span>{totalTime} min</span>
          </p>
        </div>
      </Link>
      <button
        type="button"
        className={`mt-2.5 mr-4 mb-4 ml-4 w-fit cursor-pointer border-0 bg-transparent text-left font-[650] ${
          isFavorite ? 'text-favorite' : 'text-muted hover:text-favorite'
        }`}
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
