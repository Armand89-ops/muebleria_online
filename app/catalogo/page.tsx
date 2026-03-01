"use client"

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, Search, Grid, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSidebar } from '@/components/cart-sidebar'
import { ProductCard } from '@/components/product-card'
import { products, categories } from '@/lib/products'

const sortOptions = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
  { value: 'rating', label: 'Mejor Valorados' },
  { value: 'newest', label: 'Más Nuevos' },
]

const priceRanges = [
  { min: 0, max: 100000, label: 'Todos los precios' },
  { min: 0, max: 5000, label: 'Menos de $5,000' },
  { min: 5000, max: 10000, label: '$5,000 - $10,000' },
  { min: 10000, max: 20000, label: '$10,000 - $20,000' },
  { min: 20000, max: 100000, label: 'Más de $20,000' },
]

export default function CatalogoPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || ''
  const initialSearch = searchParams.get('search') || ''

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [gridCols, setGridCols] = useState<3 | 4>(4)

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '')
    setSearchQuery(searchParams.get('search') || '')
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.subcategory.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Subcategory filter
    if (selectedSubcategories.length > 0) {
      result = result.filter((p) => selectedSubcategories.includes(p.subcategory))
    }

    // Price filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock)
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
        break
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return result
  }, [searchQuery, selectedCategory, selectedSubcategories, priceRange, inStockOnly, sortBy])

  const currentCategory = categories.find((c) => c.id === selectedCategory)

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedSubcategories([])
    setPriceRange([0, 100000])
    setInStockOnly(false)
    setSortBy('featured')
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    selectedSubcategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 100000 ||
    inStockOnly

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-sm font-medium">Buscar</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-sm font-medium">Categoría</Label>
        <div className="mt-2 space-y-2">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('')
              setSelectedSubcategories([])
            }}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              !selectedCategory
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            Todas las categorías
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setSelectedCategory(category.id)
                setSelectedSubcategories([])
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {currentCategory && (
        <div>
          <Label className="text-sm font-medium">Subcategoría</Label>
          <div className="mt-2 space-y-2">
            {currentCategory.subcategories.map((subcategory) => (
              <div key={subcategory} className="flex items-center gap-2">
                <Checkbox
                  id={subcategory}
                  checked={selectedSubcategories.includes(subcategory)}
                  onCheckedChange={() => toggleSubcategory(subcategory)}
                />
                <label
                  htmlFor={subcategory}
                  className="text-sm cursor-pointer"
                >
                  {subcategory}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium">Rango de Precio</Label>
        <div className="mt-4 px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={100000}
            step={1000}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Quick Price Filters */}
      <div>
        <Label className="text-sm font-medium">Filtros Rápidos</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {priceRanges.slice(1).map((range) => (
            <button
              key={range.label}
              type="button"
              onClick={() => setPriceRange([range.min, range.max])}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                priceRange[0] === range.min && priceRange[1] === range.max
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="inStock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
        />
        <label htmlFor="inStock" className="text-sm cursor-pointer">
          Solo productos en stock
        </label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          <X className="h-4 w-4 mr-2" />
          Limpiar Filtros
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartSidebar />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-secondary py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              {currentCategory ? currentCategory.name : 'Catálogo'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h2 className="font-medium text-lg mb-4">Filtros</h2>
                <FilterContent />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden bg-transparent">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filtros
                      {hasActiveFilters && (
                        <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          !
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Grid Toggle */}
                  <div className="hidden sm:flex items-center border border-border rounded-md">
                    <button
                      type="button"
                      onClick={() => setGridCols(3)}
                      className={`p-2 ${gridCols === 3 ? 'bg-muted' : ''}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setGridCols(4)}
                      className={`p-2 ${gridCols === 4 ? 'bg-muted' : ''}`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm text-muted-foreground">Filtros activos:</span>
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm">
                      Búsqueda: {searchQuery}
                      <button type="button" onClick={() => setSearchQuery('')}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm">
                      {currentCategory?.name}
                      <button type="button" onClick={() => setSelectedCategory('')}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedSubcategories.map((sub) => (
                    <span
                      key={sub}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm"
                    >
                      {sub}
                      <button type="button" onClick={() => toggleSubcategory(sub)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm">
                      ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                      <button type="button" onClick={() => setPriceRange([0, 100000])}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm">
                      En stock
                      <button type="button" onClick={() => setInStockOnly(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'
                  } gap-6`}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg font-medium text-foreground">
                    No se encontraron productos
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Intenta ajustar los filtros o buscar algo diferente
                  </p>
                  <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                    Limpiar Filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
