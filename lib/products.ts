export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory: string
  image: string
  images?: string[]
  rating: number
  reviews: number
  inStock: boolean
  featured: boolean
  new?: boolean
  is_new?: boolean
  colors?: string[]
  materials?: string[]
  stock?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  } | null
  created_at?: string
}

export const categories = [
  { id: 'Sala', name: 'Sala', subcategories: ['Sofás', 'Sillones', 'Mesas', 'Estantes'] },
  { id: 'Comedor', name: 'Comedor', subcategories: ['Mesas', 'Sillas', 'Bufeteros', 'Vitrinas'] },
  { id: 'Recámara', name: 'Recámara', subcategories: ['Camas', 'Burós', 'Cómodas', 'Closets'] },
  { id: 'Oficina', name: 'Oficina', subcategories: ['Escritorios', 'Sillas', 'Libreros', 'Archiveros'] },
  { id: 'Exterior', name: 'Exterior', subcategories: ['Mesas', 'Sillas', 'Sombrillas', 'Macetas'] },
  { id: 'Decoración', name: 'Decoración', subcategories: ['Lámparas', 'Espejos', 'Cuadros', 'Accesorios'] },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Sofá Milano',
    description: 'Sofá de tres plazas tapizado en terciopelo de alta calidad. Diseño elegante con líneas limpias y patas de madera de roble. Perfecto para crear un ambiente acogedor y sofisticado en tu sala.',
    price: 24999,
    originalPrice: 29999,
    category: 'Sala',
    subcategory: 'Sofás',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop',
    ],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
    new: false,
    colors: ['Gris', 'Beige', 'Verde Olivo'],
    materials: ['Terciopelo', 'Roble'],
    dimensions: { width: 220, height: 85, depth: 95 }
  },
  {
    id: '2',
    name: 'Mesa de Comedor Nórdica',
    description: 'Mesa de comedor extensible de madera maciza de roble con acabado natural. Capacidad para 6-8 personas. Diseño escandinavo minimalista que combina funcionalidad y estética.',
    price: 18999,
    category: 'Comedor',
    subcategory: 'Mesas',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop',
    ],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    featured: true,
    new: true,
    colors: ['Natural', 'Nogal'],
    materials: ['Roble Macizo'],
    dimensions: { width: 180, height: 75, depth: 90 }
  },
  {
    id: '3',
    name: 'Silla Copenhagen',
    description: 'Silla de diseño danés con asiento tapizado en piel sintética premium. Estructura de madera de haya con acabado mate. Ideal para comedor o como silla de escritorio.',
    price: 4999,
    originalPrice: 5999,
    category: 'Comedor',
    subcategory: 'Sillas',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop',
    ],
    rating: 4.7,
    reviews: 203,
    inStock: true,
    featured: false,
    new: false,
    colors: ['Negro', 'Blanco', 'Cognac'],
    materials: ['Piel Sintética', 'Haya'],
    dimensions: { width: 45, height: 82, depth: 52 }
  },
  {
    id: '4',
    name: 'Cama King Oslo',
    description: 'Cama king size con cabecero tapizado en lino natural. Base de madera de pino con acabado blanco mate. Incluye somier de láminas. El máximo confort para tu descanso.',
    price: 32999,
    category: 'Recámara',
    subcategory: 'Camas',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop',
    ],
    rating: 4.9,
    reviews: 67,
    inStock: true,
    featured: true,
    new: false,
    colors: ['Blanco', 'Gris Claro'],
    materials: ['Lino', 'Pino'],
    dimensions: { width: 200, height: 120, depth: 210 }
  },
  {
    id: '5',
    name: 'Escritorio Ejecutivo',
    description: 'Escritorio de diseño contemporáneo con amplia superficie de trabajo. Fabricado en MDF con chapa de nogal natural. Incluye organizador de cables integrado.',
    price: 15999,
    originalPrice: 18999,
    category: 'Oficina',
    subcategory: 'Escritorios',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&h=600&fit=crop',
    ],
    rating: 4.6,
    reviews: 156,
    inStock: true,
    featured: false,
    new: true,
    colors: ['Nogal', 'Blanco'],
    materials: ['MDF', 'Nogal'],
    dimensions: { width: 160, height: 75, depth: 80 }
  },
  {
    id: '6',
    name: 'Sillón Relax Vienna',
    description: 'Sillón reclinable con reposapiés integrado. Tapizado en cuero genuino con costuras decorativas. Mecanismo de reclinación suave y silencioso.',
    price: 19999,
    category: 'Sala',
    subcategory: 'Sillones',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop',
    ],
    rating: 4.8,
    reviews: 92,
    inStock: true,
    featured: true,
    new: false,
    colors: ['Marrón', 'Negro', 'Crema'],
    materials: ['Cuero Genuino', 'Acero'],
    dimensions: { width: 85, height: 105, depth: 90 }
  },
  {
    id: '7',
    name: 'Mesa de Centro Mármol',
    description: 'Mesa de centro con tapa de mármol Carrara auténtico y base de acero inoxidable dorado. Una pieza statement que eleva cualquier espacio.',
    price: 12999,
    category: 'Sala',
    subcategory: 'Mesas',
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&h=600&fit=crop',
    ],
    rating: 4.9,
    reviews: 45,
    inStock: true,
    featured: false,
    new: true,
    colors: ['Blanco Mármol'],
    materials: ['Mármol Carrara', 'Acero Inoxidable'],
    dimensions: { width: 120, height: 40, depth: 60 }
  },
  {
    id: '8',
    name: 'Mesita de Noche Minimal',
    description: 'Mesita de noche con un cajón y estante abierto. Diseño minimalista en madera de fresno con tiradores de latón. Perfecta combinación de estilo y funcionalidad.',
    price: 3999,
    category: 'Recámara',
    subcategory: 'Burós',
    image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&h=600&fit=crop',
    ],
    rating: 4.7,
    reviews: 178,
    inStock: true,
    featured: false,
    new: false,
    colors: ['Natural', 'Negro'],
    materials: ['Fresno', 'Latón'],
    dimensions: { width: 45, height: 55, depth: 40 }
  },
  {
    id: '9',
    name: 'Aparador Vintage',
    description: 'Aparador de estilo mid-century con puertas de celosía. Fabricado en madera de mango con patas cónicas. Amplio espacio de almacenamiento interior.',
    price: 16999,
    originalPrice: 19999,
    category: 'Comedor',
    subcategory: 'Bufeteros',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    ],
    rating: 4.6,
    reviews: 67,
    inStock: true,
    featured: false,
    new: false,
    colors: ['Miel', 'Nogal Oscuro'],
    materials: ['Mango', 'Latón'],
    dimensions: { width: 180, height: 80, depth: 45 }
  },
  {
    id: '10',
    name: 'Silla de Oficina Ergonómica',
    description: 'Silla ergonómica con soporte lumbar ajustable, reposabrazos 4D y asiento de malla transpirable. Mecanismo sincronizado para máximo confort durante largas jornadas.',
    price: 8999,
    category: 'Oficina',
    subcategory: 'Sillas',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop',
    ],
    rating: 4.8,
    reviews: 234,
    inStock: true,
    featured: true,
    new: false,
    colors: ['Negro', 'Gris'],
    materials: ['Malla', 'Aluminio'],
    dimensions: { width: 68, height: 115, depth: 68 }
  },
  {
    id: '11',
    name: 'Estante Modular',
    description: 'Sistema de estantería modular personalizable. Estructura de metal negro mate con estantes de roble. Configura según tus necesidades de espacio.',
    price: 7999,
    category: 'Sala',
    subcategory: 'Estantes',
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=600&fit=crop',
    ],
    rating: 4.5,
    reviews: 89,
    inStock: true,
    featured: false,
    new: true,
    colors: ['Negro/Roble'],
    materials: ['Acero', 'Roble'],
    dimensions: { width: 120, height: 200, depth: 35 }
  },
  {
    id: '12',
    name: 'Cómoda Art Deco',
    description: 'Cómoda de seis cajones con frentes curvos y detalles en latón. Inspirada en el glamour Art Deco. Acabado en laca de alto brillo.',
    price: 21999,
    category: 'Recámara',
    subcategory: 'Cómodas',
    image: 'https://images.unsplash.com/photo-1551298370-9d3d53bc4f23?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551298370-9d3d53bc4f23?w=800&h=600&fit=crop',
    ],
    rating: 4.9,
    reviews: 34,
    inStock: true,
    featured: true,
    new: false,
    colors: ['Blanco', 'Verde Esmeralda', 'Azul Marino'],
    materials: ['MDF Lacado', 'Latón'],
    dimensions: { width: 140, height: 85, depth: 50 }
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured)
}

export function getNewProducts(): Product[] {
  return products.filter(p => p.new)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(p =>
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.category.toLowerCase().includes(lowercaseQuery) ||
    p.subcategory.toLowerCase().includes(lowercaseQuery)
  )
}

export function filterProducts(filters: {
  category?: string
  subcategory?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  materials?: string[]
}): Product[] {
  return products.filter(p => {
    if (filters.category && p.category !== filters.category) return false
    if (filters.subcategory && p.subcategory !== filters.subcategory) return false
    if (filters.minPrice && p.price < filters.minPrice) return false
    if (filters.maxPrice && p.price > filters.maxPrice) return false
    if (filters.inStock !== undefined && p.inStock !== filters.inStock) return false
    if (filters.materials?.length && !filters.materials.some(m => p.materials?.includes(m))) return false
    return true
  })
}
