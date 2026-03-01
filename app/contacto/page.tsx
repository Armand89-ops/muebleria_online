"use client"

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSidebar } from '@/components/cart-sidebar'

const contactInfo = [
  {
    icon: Phone,
    title: 'Telefono',
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
  'Informacion de productos',
  'Estado de mi pedido',
  'Devoluciones y cambios',
  'Asesoramiento de diseno',
  'Pedidos corporativos',
  'Otro',
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
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
              Nuestro equipo esta listo para responder tus preguntas y ayudarte a encontrar los muebles perfectos para tu espacio.
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
                    Gracias por contactarnos. Nuestro equipo revisara tu mensaje y te respondera en un plazo de 24 horas.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">Enviar Otro Mensaje</Button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Enviar un Mensaje</h2>
                  <p className="text-muted-foreground mb-8">Completa el formulario y nos pondremos en contacto contigo lo antes posible.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" required className="mt-1.5" placeholder="Tu nombre" />
                      </div>
                      <div>
                        <Label htmlFor="email">Correo Electronico</Label>
                        <Input id="email" type="email" required className="mt-1.5" placeholder="tu@email.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Telefono (opcional)</Label>
                        <Input id="phone" type="tel" className="mt-1.5" placeholder="+52 55 1234 5678" />
                      </div>
                      <div>
                        <Label htmlFor="topic">Asunto</Label>
                        <select
                          id="topic"
                          required
                          className="mt-1.5 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                        >
                          <option value="">Selecciona un tema</option>
                          {topics.map(topic => (
                            <option key={topic} value={topic}>{topic}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="orderNumber">Numero de Pedido (si aplica)</Label>
                      <Input id="orderNumber" className="mt-1.5" placeholder="LUXE-XXXXXXXX" />
                    </div>

                    <div>
                      <Label htmlFor="message">Mensaje</Label>
                      <Textarea
                        id="message"
                        required
                        rows={5}
                        className="mt-1.5 resize-none"
                        placeholder="Describe tu consulta o comentario..."
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Enviar Mensaje
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
