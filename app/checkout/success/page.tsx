import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="font-serif text-4xl font-bold">¡Pago exitoso! 🎉</h1>
                <p className="text-muted-foreground mt-4">
                    Tu pedido está siendo procesado. Te enviaremos un correo con los detalles.
                </p>
                <Button asChild className="mt-8">
                    <Link href="/">Volver al inicio</Link>
                </Button>
            </div>
        </div>
    )
}