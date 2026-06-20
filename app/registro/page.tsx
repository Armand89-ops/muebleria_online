"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, UserPlus, ArrowRight, Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'
import { ClientCartSidebar } from '@/components/client-cart-sidebar'
import { useAuth } from '@/context/auth-context'

export default function RegisterPage() {
    const router = useRouter()
    const { register } = useAuth()
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [emailSent, setEmailSent] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')
    const [registeredName, setRegisteredName] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        if (fieldErrors[e.target.name]) setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }

    const validate = () => {
        const errors: Record<string, string> = {}
        if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio'
        if (!form.apellido.trim()) errors.apellido = 'El apellido es obligatorio'
        if (!form.email.trim()) errors.email = 'El correo es obligatorio'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Formato de correo no válido'
        if (!form.password) errors.password = 'La contraseña es obligatoria'
        else if (form.password.length < 6) errors.password = 'Mínimo 6 caracteres'
        if (form.password !== form.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden'
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validate()) return

        setLoading(true)
        const result = await register({
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            password: form.password,
        })

        if (result.success) {
            // Mostrar pantalla "Revisa tu correo" en vez de redirigir
            setRegisteredEmail(form.email)
            setRegisteredName(form.nombre)
            setEmailSent(true)
        } else {
            setError(result.error || 'Error al crear la cuenta')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col">
            <ClientHeader />
            <ClientCartSidebar />

            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">

                {/* Pantalla de éxito: revisa tu correo */}
                {emailSent ? (
                    <div className="bg-card border border-border rounded-lg p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <Mail className="h-8 w-8 text-green-600" />
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto -mt-2 mb-4" />
                        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                            ¡Revisa tu correo!
                        </h1>
                        <p className="text-muted-foreground mb-1">
                            Hola <strong>{registeredName}</strong>, enviamos un correo de verificación a:
                        </p>
                        <p className="font-medium text-foreground text-lg mb-6 bg-muted rounded-md py-2 px-4">
                            {registeredEmail}
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                            Haz clic en el enlace del correo para activar tu cuenta. El enlace expira en <strong>24 horas</strong>.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button asChild>
                                <Link href="/login">Ir a iniciar sesión</Link>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={async () => {
                                    try {
                                        await fetch('/api/auth/send-verification', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ email: registeredEmail }),
                                        })
                                        alert('Correo reenviado. Revisa tu bandeja de entrada.')
                                    } catch {
                                        alert('Error al reenviar. Intenta más tarde.')
                                    }
                                }}
                            >
                                Reenviar correo
                            </Button>
                        </div>
                    </div>
                ) : (
                <>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="h-7 w-7" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">Crear Cuenta</h1>
                        <p className="mt-2 text-muted-foreground">
                            Registrate para acceder a todas las funciones
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        placeholder="Juan"
                                        className={`mt-1.5 ${fieldErrors.nombre ? 'border-destructive' : ''}`}
                                        required
                                    />
                                    {fieldErrors.nombre && <p className="text-xs text-destructive mt-1">{fieldErrors.nombre}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="apellido">Apellido</Label>
                                    <Input
                                        id="apellido"
                                        name="apellido"
                                        value={form.apellido}
                                        onChange={handleChange}
                                        placeholder="Pérez"
                                        className={`mt-1.5 ${fieldErrors.apellido ? 'border-destructive' : ''}`}
                                        required
                                    />
                                    {fieldErrors.apellido && <p className="text-xs text-destructive mt-1">{fieldErrors.apellido}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
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
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Mínimo 6 caracteres"
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

                            <div>
                                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repite tu contraseña"
                                    className={`mt-1.5 ${fieldErrors.confirmPassword ? 'border-destructive' : ''}`}
                                    required
                                />
                                {fieldErrors.confirmPassword && <p className="text-xs text-destructive mt-1">{fieldErrors.confirmPassword}</p>}
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </form>

                    <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                ¿Ya tienes cuenta?{' '}
                                <Link href="/login" className="text-accent hover:underline font-medium">
                                    Iniciar Sesión
                                </Link>
                            </p>
                        </div>
                    </div>
                </> )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
