"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Check,
  Zap,
  Clock,
  Shield,
  RefreshCw,
  Database,
  Layers,
  Star,
  Play,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Sincronización en Tiempo Real",
      description:
        "Tus datos se actualizan automáticamente entre Airtable y Notion sin intervención manual.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Ahorra 5+ Horas Semanales",
      description:
        "Dile adiós a copiar y pegar datos. Dedica ese tiempo a hacer crecer tu negocio.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "100% Seguro y Confiable",
      description:
        "Encriptación de nivel empresarial. Tus datos nunca se almacenan en nuestros servidores.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Configuración en 2 Minutos",
      description:
        "Conecta tus cuentas, selecciona las bases y listo. Sin código, sin complicaciones.",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Mapeo Inteligente de Campos",
      description:
        "Nuestro AI detecta automáticamente qué campos corresponden entre plataformas.",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Sincronización Bidireccional",
      description:
        "Cambia datos en cualquiera de las dos plataformas y se refleja en la otra instantáneamente.",
    },
  ];

  const testimonials = [
    {
      name: "María García",
      role: "Freelancer & Project Manager",
      content:
        "Antes perdía 6 horas semanales sincronizando datos. Ahora todo fluye automáticamente. SyncBridge pagó por sí solo en la primera semana.",
      avatar: "MG",
      rating: 5,
    },
    {
      name: "Carlos Mendoza",
      role: "Founder, StartupTech",
      content:
        "Probé Zapier pero era demasiado complejo y caro. SyncBridge hace exactamente lo que necesito sin todas las complicaciones.",
      avatar: "CM",
      rating: 5,
    },
    {
      name: "Ana Rodríguez",
      role: "Operations Lead, Agencia Digital",
      content:
        "Mi equipo usa Airtable para operaciones y Notion para documentación. SyncBridge las mantiene perfectamente sincronizadas.",
      avatar: "AR",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      description: "Para probar y proyectos personales",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Hasta 100 sincronizaciones/mes",
        "1 conexión activa",
        "Sincronización cada 1 hora",
        "Soporte por email",
        "Campos básicos",
      ],
      cta: "Empezar Gratis",
      popular: false,
    },
    {
      name: "Pro",
      description: "Para freelancers y pequeños equipos",
      monthlyPrice: 10,
      yearlyPrice: 96,
      features: [
        "Sincronizaciones ilimitadas",
        "5 conexiones activas",
        "Sincronización en tiempo real",
        "Soporte prioritario",
        "Todos los tipos de campos",
        "Historial de cambios (7 días)",
        "Webhooks personalizados",
      ],
      cta: "Empezar Prueba Gratis",
      popular: true,
    },
    {
      name: "Team",
      description: "Para equipos en crecimiento",
      monthlyPrice: 29,
      yearlyPrice: 276,
      features: [
        "Todo lo de Pro",
        "Conexiones ilimitadas",
        "Historial de cambios (30 días)",
        "Soporte dedicado",
        "API access",
        "SSO & SAML",
        "Onboarding personalizado",
      ],
      cta: "Contactar Ventas",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">SyncBridge</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Precios
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">Login</Button>
              <Button size="sm">Empezar Gratis</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-6 px-4 py-2 text-sm bg-purple-100 text-purple-700">
              🚀 Próximo lanzamiento en Product Hunt
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              Sincroniza{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Airtable
              </span>{" "}
              y{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Notion
              </span>
              <br />
              <span className="text-foreground">Automáticamente</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Deja de perder 5+ horas semanales copiando datos manualmente.
              SyncBridge conecta tus herramientas favoritas en 2 minutos, sin código.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8">
                Empezar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Setup en 2 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Cancela cuando quieras</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Todo lo que necesitas para sincronizar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Diseñado para ser simple pero potente. Sin configuraciones complejas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4">Precios</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Precios simples y transparentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empieza gratis, escala cuando crezcas. Sin cargos ocultos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`h-full ${plan.popular ? "border-purple-500 shadow-lg" : ""}`}>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm font-medium">
                    Más Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">${plan.monthlyPrice}</span>
                      <span className="text-muted-foreground">/mes</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimonios</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Amado por freelancers y equipos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-8 sm:p-12 text-center text-white">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                ¿Listo para dejar de copiar y pegar?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Únete a miles de usuarios que ya ahorran horas cada semana.
                Empieza gratis, sin tarjeta de crédito.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 bg-white text-purple-600 hover:bg-white/90">
                  Empezar Gratis Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">SyncBridge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SyncBridge. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
