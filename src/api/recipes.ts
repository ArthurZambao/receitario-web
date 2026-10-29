import type { Recipe, RecipeListResponse } from '../types/recipe'

const API_BASE = 'https://dummyjson.com'

export async function getRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE}/recipes?limit=0`)

  if (!response.ok) {
    throw new Error('Não foi possível carregar as receitas.')
  }

  const data = (await response.json()) as RecipeListResponse
  return data.recipes
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  const response = await fetch(`${API_BASE}/recipes/${id}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Não foi possível carregar a receita.')
  }

  return (await response.json()) as Recipe
}
