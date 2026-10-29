import { useEffect, useMemo, useState } from 'react'
import { getRecipes } from '../api/recipes'
import { RecipeCard } from '../components/RecipeCard'
import type { Recipe } from '../types/recipe'

const fieldClass = 'flex flex-col gap-1.5 text-[0.9rem] text-muted'
const inputClass =
  'w-full appearance-none rounded-xl border border-line bg-surface px-[0.9rem] py-3 text-heading focus:outline-2 focus:outline-offset-2 focus:outline-accent'

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
    return <p className="py-12">Carregando receitas...</p>
  }

  if (status === 'error') {
    return (
      <p className="py-12 text-favorite">
        Não foi possível carregar o catálogo. Tente novamente em instantes.
      </p>
    )
  }

  return (
    <section>
      <div className="mb-5 flex flex-col items-start justify-between gap-4 min-[801px]:flex-row min-[801px]:items-end">
        <div>
          <h1>Catálogo</h1>
          <p className="text-muted">
            {filteredRecipes.length} de {recipes.length} receitas
          </p>
        </div>
        <p
          className="rounded-full bg-accent-soft px-3.5 py-[0.45rem] font-bold text-accent-dark"
          aria-live="polite"
        >
          {favoriteLabel}
        </p>
      </div>

      <form
        className="mb-6 grid grid-cols-1 gap-4 min-[801px]:grid-cols-[2fr_1fr]"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className={fieldClass}>
          <span>Buscar por nome</span>
          <input
            className={inputClass}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ex.: chicken"
          />
        </label>

        <label className={fieldClass}>
          <span>Culinária</span>
          <select
            className={inputClass}
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
        <p className="py-12">Nenhuma receita encontrada com esses filtros.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[1.15rem]">
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
