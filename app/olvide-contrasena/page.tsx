'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'

export default function OlvideContrasenaPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSent(true)
      } else {
        setError(data.error || 'Error al enviar email')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />
      
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-card rounded-lg border border-border p-8">
            {!isSent ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                    Recuperar contraseña
                  </h1>
                  <p className="text-muted-foreground">
                    Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
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
                    {isLoading ? (
                      <>
                        <Mail className="mr-2 h-4 w-4 animate-pulse" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar instrucciones
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link 
                    href="/login" 
                    className="text-sm text-accent hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a iniciar sesión
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Revisa tu email
                </h1>
                <p className="text-muted-foreground mb-6">
                  Si existe una cuenta con el email <strong>{email}</strong>, 
                  recibirás instrucciones para restablecer tu contraseña.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  No olvides revisar tu carpeta de spam.
                </p>
                <Button asChild variant="outline">
                  <Link href="/login">Volver a iniciar sesión</Link>
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
