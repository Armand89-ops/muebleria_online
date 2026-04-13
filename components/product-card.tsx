"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { useWishlist } from '@/context/wishlist-context'
import type { Product } from '@/lib/products'
import { useContext } from 'react'
import { CartContext } from '@/context/cart-context'
import { WishlistContext } from '@/context/wishlist-context'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const cartContext = useContext(CartContext)
  const wishlistContext = useContext(WishlistContext)
  
  // Fallback if context not available
  if (!cartContext || !wishlistContext) {
    return null
  }
  
  const { addItem } = cartContext
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = wishlistContext
  const isFavorite = isInWishlist(product.id)

  const toggleWishlist = () => {
    if (isFavorite) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Timer logic for 2 days
  const isActuallyNew = () => {
    if (!product.new && !product.is_new) return false;
    
    if (product.created_at) {
      const createdDate = new Date(product.created_at).getTime();
      const now = new Date().getTime();
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
      if (now - createdDate > twoDaysInMs) {
        return false;
      }
    }
    return true; // If no created_at, fallback to true if is_new is set
  }

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isActuallyNew() && (
          <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
            Nuevo
          </span>
        )}
        {product.originalPrice && (
          <span className="px-2 py-1 bg-destructive text-white text-xs font-medium rounded">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Quick action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className={`h-8 w-8 transition-all ${isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist()
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
          <span className="sr-only">Agregar a favoritos</span>
        </Button>
        <Button
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90"
          onClick={(e) => {
            e.preventDefault()
            addItem(product)
          }}
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="sr-only">Agregar al carrito</span>
        </Button>
      </div>

      {/* Image */}
      <Link href={`/producto/${product.id}`} className="block">
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/producto/${product.id}`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.subcategory}
          </p>
          <h3 className="font-serif text-lg font-medium text-card-foreground group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(product.rating)
                    ? 'fill-accent text-accent'
                    : 'fill-muted text-muted'
                  }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-card-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-3 flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
              {product.colors.length} {product.colors.length === 1 ? 'color' : 'colores'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
