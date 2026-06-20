import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CancelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="font-serif text-4xl font-bold">Pago cancelado</h1>
                <p className="text-muted-foreground mt-4">
                    No se realizó ningún cobro. Puedes intentarlo de nuevo cuando quieras.
                </p>
                <Button asChild className="mt-8">
                    <Link href="/catalogo">Volver al catálogo</Link>
                </Button>
            </div>
        </div>
    )
}