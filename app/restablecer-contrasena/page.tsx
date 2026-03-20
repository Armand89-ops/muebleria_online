'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle, XCircle, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'

function RestablecerContrasenaContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setError(data.error || 'Error al restablecer contraseña')
      }
    } catch {
      setStatus('error')
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col">
        <ClientHeader />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="max-w-md w-full mx-auto px-4">
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                Enlace inválido
              </h1>
              <p className="text-muted-foreground mb-6">
                El enlace para restablecer contraseña no es válido o ha expirado.
              </p>
              <Button asChild>
                <Link href="/olvide-contrasena">Solicitar nuevo enlace</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />
      
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-card rounded-lg border border-border p-8">
            {status === 'form' && (
              <>
                <div className="text-center mb-8">
                  <Lock className="h-12 w-12 text-accent mx-auto mb-4" />
                  <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                    Nueva contraseña
                  </h1>
                  <p className="text-muted-foreground">
                    Ingresa tu nueva contraseña
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="password">Nueva contraseña</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      required
                      className="mt-1"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
                  </Button>
                </form>
              </>
            )}

            {status === 'success' && (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Contraseña actualizada
                </h1>
                <p className="text-muted-foreground mb-6">
                  Tu contraseña ha sido cambiada correctamente. Ya puedes iniciar sesión.
                </p>
                <Button asChild>
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Error
                </h1>
                <p className="text-muted-foreground mb-6">
                  {error}
                </p>
                <Button asChild>
                  <Link href="/olvide-contrasena">Solicitar nuevo enlace</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <Loader2 className="h-16 w-16 text-accent animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function RestablecerContrasenaPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RestablecerContrasenaContent />
    </Suspense>
  )
}
