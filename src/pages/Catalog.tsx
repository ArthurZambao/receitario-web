import { useEffect, useMemo, useState } from 'react'
import { getRecipes } from '../api/recipes'
import { RecipeCard } from '../components/RecipeCard'
import type { Recipe } from '../types/recipe'

export function Catalog() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [search, setSearch] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getRecipes()
        if (!cancelled) {
          setRecipes(data)
          setStatus('ready')
        }
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
  }, [])

  const cuisines = useMemo(() => {
    return [...new Set(recipes.map((recipe) => recipe.cuisine))].sort((a, b) =>
      a.localeCompare(b, 'pt-BR'),
    )
  }, [recipes])

  const filteredRecipes = useMemo(() => {
    const query = search.trim().toLowerCase()

    return recipes.filter((recipe) => {
      const matchesName = recipe.name.toLowerCase().includes(query)
      const matchesCuisine = cuisine === '' || recipe.cuisine === cuisine
      return matchesName && matchesCuisine
    })
  }, [recipes, search, cuisine])

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    )
  }

  const favoriteCount = favorites.length
  const favoriteLabel =
    favoriteCount === 1 ? '1 favorita' : `${favoriteCount} favoritas`

  if (status === 'loading') {
    return <p className="status-message">Carregando receitas...</p>
  }

  if (status === 'error') {
    return (
      <p className="status-message status-message--error">
        Não foi possível carregar o catálogo. Tente novamente em instantes.
      </p>
    )
  }

  return (
    <section className="catalog">
      <div className="catalog__top">
        <div>
          <h1>Catálogo</h1>
          <p className="catalog__subtitle">
            {filteredRecipes.length} de {recipes.length} receitas
          </p>
        </div>
        <p className="favorites-count" aria-live="polite">
          {favoriteLabel}
        </p>
      </div>

      <form className="catalog__filters" onSubmit={(event) => event.preventDefault()}>
        <label className="field">
          <span>Buscar por nome</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ex.: chicken"
          />
        </label>

        <label className="field">
          <span>Culinária</span>
          <select
            value={cuisine}
            onChange={(event) => setCuisine(event.target.value)}
          >
            <option value="">Todas</option>
            {cuisines.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </form>

      {filteredRecipes.length === 0 ? (
        <p className="status-message">
          Nenhuma receita encontrada com esses filtros.
        </p>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  )
}
