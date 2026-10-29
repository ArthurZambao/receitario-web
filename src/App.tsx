import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Catalog } from './pages/Catalog'
import { NotFound } from './pages/NotFound'
import { RecipeDetail } from './pages/RecipeDetail'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Catalog />} />
        <Route path="/receitas/:id" element={<RecipeDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
