"use client"

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ClientHeader } from '@/components/client-header'
import { Footer } from '@/components/footer'
import { ClientCartSidebar } from '@/components/client-cart-sidebar'

const contactInfo = [
  {
    icon: Phone,
    title: 'Teléfono',
    detail: '+52 55 1234 5678',
    subtitle: 'Lun - Vie, 9:00 - 18:00',
  },
  {
    icon: Mail,
    title: 'Correo',
    detail: 'hola@luxefurniture.mx',
    subtitle: 'Respondemos en 24 horas',
  },
  {
    icon: MapPin,
    title: 'Showroom Principal',
    detail: 'Av. Presidente Masaryk 460',
    subtitle: 'Polanco, CDMX 11560',
  },
  {
    icon: Clock,
    title: 'Horario',
    detail: 'Lun - Sab: 10:00 - 20:00',
    subtitle: 'Dom: 11:00 - 18:00',
  },
]

const topics = [
  'Información de productos',
  'Estado de mi pedido',
  'Devoluciones y cambios',
  'Asesoramiento de diseño',
  'Pedidos corporativos',
  'Otro',
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    numeroPedido: '',
    mensaje: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es obligatorio'
    if (!formData.email.trim()) errors.email = 'El correo es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Correo no válido'
    if (!formData.asunto) errors.asunto = 'Selecciona un asunto'
    if (!formData.mensaje.trim()) errors.mensaje = 'El mensaje es obligatorio'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Error al enviar el mensaje')
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
    }
    setSending(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />
      <ClientCartSidebar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary py-3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Inicio</Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Contacto</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground text-balance">Estamos para Ayudarte</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Nuestro equipo está listo para responder tus preguntas y ayudarte a encontrar los muebles perfectos para tu espacio.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactInfo.map(info => {
                const Icon = info.icon
                return (
                  <div key={info.title} className="bg-card border border-border rounded-lg p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{info.title}</h3>
                    <p className="text-sm font-medium text-foreground">{info.detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">{info.subtitle}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12 lg:py-16 bg-secondary">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="bg-card border border-border rounded-lg p-6 lg:p-10">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <Send className="h-7 w-7 text-green-600" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Mensaje Enviado</h2>
                  <p className="text-muted-foreground mb-8">
                    Gracias por contactarnos. Nuestro equipo revisará tu mensaje y te responderá en un plazo de 24 horas.
                  </p>
                  <Button onClick={() => { setSubmitted(false); setFormData({ nombre: '', email: '', telefono: '', asunto: '', numeroPedido: '', mensaje: '' }) }} variant="outline">Enviar Otro Mensaje</Button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Enviar un Mensaje</h2>
                  <p className="text-muted-foreground mb-8">Completa el formulario y nos pondremos en contacto contigo lo antes posible.</p>

                  {error && (
                    <div className="mb-6 p-3 rounded-md text-sm bg-destructive/10 text-destructive">{error}</div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} required className={`mt-1.5 ${fieldErrors.nombre ? 'border-destructive' : ''}`} placeholder="Tu nombre" />
                        {fieldErrors.nombre && <p className="text-xs text-destructive mt-1">{fieldErrors.nombre}</p>}
                      </div>
                      <div>
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} required className={`mt-1.5 ${fieldErrors.email ? 'border-destructive' : ''}`} placeholder="tu@email.com" />
                        {fieldErrors.email && <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Teléfono (opcional)</Label>
                        <Input id="phone" type="tel" value={formData.telefono} onChange={e => handleChange('telefono', e.target.value)} className="mt-1.5" placeholder="+52 55 1234 5678" />
                      </div>
                      <div>
                        <Label htmlFor="topic">Asunto</Label>
                        <select
                          id="topic"
                          value={formData.asunto}
                          onChange={e => handleChange('asunto', e.target.value)}
                          required
                          className={`mt-1.5 w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm ${fieldErrors.asunto ? 'border-destructive' : 'border-border'}`}
                        >
                          <option value="">Selecciona un tema</option>
                          {topics.map(topic => (
                            <option key={topic} value={topic}>{topic}</option>
                          ))}
                        </select>
                        {fieldErrors.asunto && <p className="text-xs text-destructive mt-1">{fieldErrors.asunto}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="orderNumber">Número de Pedido (si aplica)</Label>
                      <Input id="orderNumber" value={formData.numeroPedido} onChange={e => handleChange('numeroPedido', e.target.value)} className="mt-1.5" placeholder="LUXE-XXXXXXXX" />
                    </div>

                    <div>
                      <Label htmlFor="message">Mensaje</Label>
                      <Textarea
                        id="message"
                        value={formData.mensaje}
                        onChange={e => handleChange('mensaje', e.target.value)}
                        required
                        rows={5}
                        className={`mt-1.5 resize-none ${fieldErrors.mensaje ? 'border-destructive' : ''}`}
                        placeholder="Describe tu consulta o comentario..."
                      />
                      {fieldErrors.mensaje && <p className="text-xs text-destructive mt-1">{fieldErrors.mensaje}</p>}
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={sending}>
                      {sending ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando...</>
                      ) : (
                        'Enviar Mensaje'
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
