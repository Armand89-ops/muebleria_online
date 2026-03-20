'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'

function VerificarEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token no proporcionado')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok && data.success) {
          setStatus('success')
          setMessage('Tu email ha sido verificado correctamente')
        } else {
          setStatus('error')
          setMessage(data.error || 'Error al verificar email')
        }
      } catch {
        setStatus('error')
        setMessage('Error de conexión. Intenta de nuevo.')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />
      
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 text-accent animate-spin mx-auto mb-4" />
                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Verificando email...
                </h1>
                <p className="text-muted-foreground">
                  Por favor espera un momento
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Email verificado
                </h1>
                <p className="text-muted-foreground mb-6">
                  {message}
                </p>
                <Button asChild>
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Error de verificación
                </h1>
                <p className="text-muted-foreground mb-6">
                  {message}
                </p>
                <div className="flex flex-col gap-3">
                  <Button asChild variant="outline">
                    <Link href="/login">Ir a iniciar sesión</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/registro">Crear nueva cuenta</Link>
                  </Button>
                </div>
              </>
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

export default function VerificarEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerificarEmailContent />
    </Suspense>
  )
}
