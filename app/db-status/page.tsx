"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Database, Server, Package, Table, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react'

interface DbStatus {
    connected: boolean
    mysqlVersion: string | null
    database: string | null
    productCount: number | null
    tables: string[]
    error: string | null
    timestamp: string
}

interface Product {
    id: string
    name: string
    price: number
    category: string
    subcategory: string
    image: string
    featured: boolean
    is_new: boolean
    inStock: boolean
}

export default function DbStatusPage() {
    const [status, setStatus] = useState<DbStatus | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const checkConnection = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/db-status')

            if (res.status === 403) {
                setError('Esta página solo está disponible en modo desarrollo.')
                setLoading(false)
                return
            }

            const data = await res.json()
            setStatus(data)

            if (data.connected) {
                setLoadingProducts(true)
                try {
                    const prodRes = await fetch('/api/products')
                    const prodData = await prodRes.json()
                    setProducts(Array.isArray(prodData) ? prodData : [])
                } catch {
                    setProducts([])
                }
                setLoadingProducts(false)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo conectar al servidor')
        }
        setLoading(false)
    }

    useEffect(() => {
        checkConnection()
    }, [])

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
        }).format(price)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Database className="h-6 w-6 text-emerald-400" />
                        <h1 className="text-xl font-bold">Estado de la Base de Datos</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={checkConnection}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Verificar
                        </button>
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al sitio
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-emerald-400 mb-4" />
                        <p className="text-lg text-slate-300">Verificando conexión a la base de datos...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
                        <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-red-300 mb-2">Error de Conexión</h2>
                        <p className="text-red-200/80">{error}</p>
                        <button
                            onClick={checkConnection}
                            className="mt-6 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : status ? (
                    <div className="space-y-6">
                        {/* Main Status Card */}
                        <div className={`rounded-xl p-8 border ${status.connected
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                            }`}>
                            <div className="flex items-center gap-4">
                                {status.connected ? (
                                    <CheckCircle className="h-16 w-16 text-emerald-400 flex-shrink-0" />
                                ) : (
                                    <XCircle className="h-16 w-16 text-red-400 flex-shrink-0" />
                                )}
                                <div>
                                    <h2 className={`text-3xl font-bold ${status.connected ? 'text-emerald-300' : 'text-red-300'
                                        }`}>
                                        {status.connected ? '¡Conexión Exitosa!' : 'Conexión Fallida'}
                                    </h2>
                                    <p className={`mt-1 text-lg ${status.connected ? 'text-emerald-200/70' : 'text-red-200/70'
                                        }`}>
                                        {status.connected
                                            ? 'La base de datos MySQL está conectada y funcionando correctamente.'
                                            : status.error || 'No se pudo establecer conexión con la base de datos.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <Server className="h-5 w-5 text-blue-400" />
                                    <span className="text-sm text-slate-400 font-medium">MySQL Versión</span>
                                </div>
                                <p className="text-2xl font-bold">{status.mysqlVersion || '—'}</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <Database className="h-5 w-5 text-purple-400" />
                                    <span className="text-sm text-slate-400 font-medium">Base de Datos</span>
                                </div>
                                <p className="text-2xl font-bold">{status.database || '—'}</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <Package className="h-5 w-5 text-amber-400" />
                                    <span className="text-sm text-slate-400 font-medium">Productos</span>
                                </div>
                                <p className="text-2xl font-bold">{status.productCount ?? '—'}</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <Table className="h-5 w-5 text-emerald-400" />
                                    <span className="text-sm text-slate-400 font-medium">Tablas</span>
                                </div>
                                <p className="text-2xl font-bold">{status.tables.length}</p>
                            </div>
                        </div>

                        {/* Tables List */}
                        {status.tables.length > 0 && (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Table className="h-5 w-5 text-slate-400" />
                                    Tablas en la Base de Datos
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {status.tables.map((table) => (
                                        <span
                                            key={table}
                                            className="px-3 py-1.5 bg-white/10 rounded-lg text-sm font-mono"
                                        >
                                            {table}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Error Details */}
                        {status.error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-red-300 mb-2">Detalle del Error</h3>
                                <pre className="text-sm text-red-200/70 bg-red-500/10 rounded-lg p-4 overflow-x-auto font-mono">
                                    {status.error}
                                </pre>
                            </div>
                        )}

                        {/* Products Preview */}
                        {status.connected && (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Package className="h-5 w-5 text-slate-400" />
                                    Productos en la Base de Datos
                                </h3>
                                {loadingProducts ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                                        <span className="ml-2 text-slate-300">Cargando productos...</span>
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Package className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                                        <p className="text-slate-400">No hay productos en la base de datos.</p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Ejecuta el script <code className="bg-white/10 px-2 py-0.5 rounded font-mono text-xs">scripts/setup-db.sql</code> para insertar datos de ejemplo.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">ID</th>
                                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Nombre</th>
                                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Precio</th>
                                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Categoría</th>
                                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Subcategoría</th>
                                                    <th className="text-center py-3 px-4 text-slate-400 font-medium">Destacado</th>
                                                    <th className="text-center py-3 px-4 text-slate-400 font-medium">Nuevo</th>
                                                    <th className="text-center py-3 px-4 text-slate-400 font-medium">Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((product) => (
                                                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="py-3 px-4 font-mono text-slate-300">{product.id}</td>
                                                        <td className="py-3 px-4 font-medium">{product.name}</td>
                                                        <td className="py-3 px-4 text-emerald-300">{formatPrice(product.price)}</td>
                                                        <td className="py-3 px-4 text-slate-300">{product.category}</td>
                                                        <td className="py-3 px-4 text-slate-300">{product.subcategory}</td>
                                                        <td className="py-3 px-4 text-center">
                                                            {product.featured ? (
                                                                <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                                                            ) : (
                                                                <span className="inline-block w-2 h-2 rounded-full bg-slate-600"></span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            {product.is_new ? (
                                                                <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                                                            ) : (
                                                                <span className="inline-block w-2 h-2 rounded-full bg-slate-600"></span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            {product.inStock ? (
                                                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                                                            ) : (
                                                                <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Timestamp */}
                        <p className="text-center text-sm text-slate-500">
                            Última verificación: {new Date(status.timestamp).toLocaleString('es-MX')}
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
