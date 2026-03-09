"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSidebar } from '@/components/cart-sidebar'
import { useAuth } from '@/context/auth-context'

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const validate = () => {
        const errors: Record<string, string> = {}
        if (!email.trim()) errors.email = 'El correo es obligatorio'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Formato de correo no válido'
        if (!password) errors.password = 'La contraseña es obligatoria'
        else if (password.length < 6) errors.password = 'Mínimo 6 caracteres'
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validate()) return

        setLoading(true)

        const result = await login(email, password)

        if (result.success) {
            router.push('/cuenta')
        } else {
            setError(result.error || 'Error al iniciar sesión')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <CartSidebar />

            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                            <LogIn className="h-7 w-7" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">Iniciar Sesión</h1>
                        <p className="mt-2 text-muted-foreground">
                            Ingresa a tu cuenta para continuar
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
                        {error && (
                            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors(p => ({ ...p, email: '' })) }}
                                    placeholder="tu@email.com"
                                    className={`mt-1.5 ${fieldErrors.email ? 'border-destructive' : ''}`}
                                    required
                                />
                                {fieldErrors.email && <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative mt-1.5">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors(p => ({ ...p, password: '' })) }}
                                        placeholder="••••••••"
                                        className={`pr-10 ${fieldErrors.password ? 'border-destructive' : ''}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {fieldErrors.password && <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>}
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                ¿No tienes cuenta?{' '}
                                <Link href="/registro" className="text-accent hover:underline font-medium">
                                    Crear cuenta
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
