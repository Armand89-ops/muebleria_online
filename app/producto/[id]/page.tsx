"use client"

import React from 'react'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Star, Minus, Plus, Truck, Shield, RotateCcw, ChevronRight, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSidebar } from '@/components/cart-sidebar'
import { ProductCard } from '@/components/product-card'
import { useCart } from '@/context/cart-context'
import { useWishlist } from '@/context/wishlist-context'
import type { Product } from '@/lib/products'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([])
  const [userHasReviewed, setUserHasReviewed] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewHover, setReviewHover] = useState(0)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [userHasPurchased, setUserHasPurchased] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Producto no encontrado')
        return res.json()
      })
      .then((data) => {
        setProduct(data.product || null)
        if (data.product) {
          setSelectedColor(data.product.colors?.[0] ?? '')
        }
        setRelatedProducts(data.related || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  // Load reviews
  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}/reviews`)
        .then(res => res.json())
        .then(data => {
          setReviews(data.reviews || [])
          setUserHasReviewed(data.userHasReviewed || false)
          setUserHasPurchased(data.userHasPurchased || false)
        })
        .catch(() => { })
    }
  }, [id, reviewSuccess])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <CartSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Cargando producto...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <CartSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground">Producto no encontrado</h1>
            <p className="mt-2 text-muted-foreground">El producto que buscas no existe.</p>
            <Link href="/catalogo">
              <Button className="mt-6">Volver al Catalogo</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isFavorite = isInWishlist(product.id)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor)
  }

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      setReviewError('Selecciona una calificación')
      return
    }
    setReviewSubmitting(true)
    setReviewError('')
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calificacion: reviewRating, titulo: reviewTitle, comentario: reviewComment }),
      })
      const data = await res.json()
      if (res.ok) {
        setReviewSuccess(true)
        setReviewRating(0)
        setReviewTitle('')
        setReviewComment('')
        // Refresh product data to update rating
        fetch(`/api/products/${id}`)
          .then(r => r.json())
          .then(d => { if (d.product) setProduct(d.product) })
          .catch(() => { })
      } else {
        setReviewError(data.error || 'Error al enviar')
      }
    } catch {
      setReviewError('Error de conexión')
    }
    setReviewSubmitting(false)
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartSidebar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary py-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Inicio
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link href="/catalogo" className="text-muted-foreground hover:text-foreground transition-colors">
                Catálogo
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link
                href={`/catalogo?category=${product.category}`}
                className="text-muted-foreground hover:text-foreground transition-colors capitalize"
              >
                {product.category === 'living' ? 'Sala' : product.category === 'dining' ? 'Comedor' : product.category === 'bedroom' ? 'Dormitorio' : 'Oficina'}
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium truncate">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Section */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Images */}
              <div className="space-y-4">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={(product.images && product.images[selectedImage]) || product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {(product.new || product.is_new) && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded">
                      Nuevo
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-destructive text-white text-sm font-medium rounded">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-transparent'
                          }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} - Imagen ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="lg:py-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  {product.subcategory}
                </p>
                <h1 className="mt-2 font-serif text-3xl lg:text-4xl font-bold text-foreground">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating)
                          ? 'fill-accent text-accent'
                          : 'fill-muted text-muted'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reseñas)
                  </span>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-foreground">
                      Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 text-sm rounded-md border transition-colors ${selectedColor === color
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                            }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-foreground">Cantidad</h3>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-md">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-muted transition-colors"
                        disabled={quantity <= 1 || !product.inStock}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-6 text-lg font-medium">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-muted transition-colors"
                        disabled={!product.inStock || (product.stock != null && quantity >= product.stock)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm">
                      {!product.inStock || (product.stock != null && product.stock <= 0) ? (
                        <span className="text-destructive font-medium">Agotado</span>
                      ) : product.stock != null && product.stock <= 5 ? (
                        <span className="text-yellow-600 font-medium">Últimas {product.stock} unidades</span>
                      ) : (
                        <span className="text-muted-foreground">En stock</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    Agregar al Carrito - {formatPrice(product.price * quantity)}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => isFavorite ? removeFromWishlist(product.id) : addToWishlist(product)}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
                    {isFavorite ? 'En Favoritos' : 'Favoritos'}
                  </Button>
                </div>

                {/* Features */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Envío Gratis</p>
                      <p className="text-xs text-muted-foreground">En pedidos +$5,000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Garantía</p>
                      <p className="text-xs text-muted-foreground">5 años de cobertura</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <RotateCcw className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Devoluciones</p>
                      <p className="text-xs text-muted-foreground">30 días para devolver</p>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                {(product.dimensions || (product.materials && product.materials.length > 0)) && (
                  <div className="mt-10 border-t border-border pt-8">
                    <h3 className="text-lg font-medium text-foreground">Especificaciones</h3>
                    <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      {product.dimensions && (
                        <div>
                          <dt className="text-muted-foreground">Dimensiones</dt>
                          <dd className="mt-1 font-medium">
                            {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm
                          </dd>
                        </div>
                      )}
                      {product.materials && product.materials.length > 0 && (
                        <div>
                          <dt className="text-muted-foreground">Materiales</dt>
                          <dd className="mt-1 font-medium">{product.materials.join(', ')}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-muted-foreground">Categoría</dt>
                        <dd className="mt-1 font-medium">{product.subcategory}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">SKU</dt>
                        <dd className="mt-1 font-medium">LUXE-{product.id.padStart(6, '0')}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-8">
              Reseñas ({product.reviews})
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Review Form */}
              <div className="lg:col-span-1">
                {!userHasPurchased && !reviewSuccess ? (
                  <div className="bg-card border border-border rounded-lg p-6 text-center">
                    <Star className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-foreground">¿Quieres dejar una reseña?</p>
                    <p className="text-sm text-muted-foreground mt-1">Compra este producto primero para poder compartir tu experiencia</p>
                  </div>
                ) : !userHasReviewed && !reviewSuccess ? (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-medium text-foreground mb-4">Dejar una Reseña</h3>

                    {/* Star Rating Picker */}
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Tu calificación</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setReviewHover(star)}
                            onMouseLeave={() => setReviewHover(0)}
                            className="p-0.5"
                          >
                            <Star className={`h-7 w-7 transition-colors ${star <= (reviewHover || reviewRating)
                              ? 'fill-accent text-accent'
                              : 'fill-muted text-muted'
                              }`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm text-muted-foreground block mb-1">Título (opcional)</label>
                      <input
                        value={reviewTitle}
                        onChange={e => setReviewTitle(e.target.value)}
                        placeholder="Resumen de tu experiencia"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-sm text-muted-foreground block mb-1">Comentario (opcional)</label>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Cuéntanos más sobre tu experiencia..."
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm resize-none"
                      />
                    </div>

                    {reviewError && (
                      <p className="text-sm text-destructive mb-3">{reviewError}</p>
                    )}

                    <Button
                      onClick={handleSubmitReview}
                      disabled={reviewSubmitting}
                      className="w-full"
                    >
                      {reviewSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <Star className="h-6 w-6 text-green-600 fill-green-600" />
                    </div>
                    <p className="font-medium text-foreground">
                      {reviewSuccess ? '¡Gracias por tu reseña!' : 'Ya dejaste una reseña'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Tu opinión ayuda a otros compradores</p>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Aún no hay reseñas para este producto</p>
                    <p className="text-sm text-muted-foreground mt-1">Sé el primero en dejar una reseña</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                              {review.nombre?.[0]}{review.apellido?.[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{review.nombre} {review.apellido}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.calificacion ? 'fill-accent text-accent' : 'fill-muted text-muted'}`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.titulo && (
                          <p className="font-medium text-foreground mb-1">{review.titulo}</p>
                        )}
                        {review.comentario && (
                          <p className="text-sm text-muted-foreground leading-relaxed">{review.comentario}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12 lg:py-16 bg-secondary">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-8">
                Productos Relacionados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
