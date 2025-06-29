import { Ticket, Users, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "@/modules/shared/components/ui/card";

const features = [
  {
    icon: Ticket,
    title: "Tickets seguros",
    description:
      "QR codes únicos y sistema anti-fraude para garantizar la autenticidad de cada entrada.",
  },
  {
    icon: Users,
    title: "Para todos",
    description:
      "Eventos underground y mainstream en una sola plataforma, democratizando el acceso.",
  },
  {
    icon: Shield,
    title: "Pagos protegidos",
    description:
      "Procesamiento seguro con MercadoPago y protección completa del comprador.",
  },
  {
    icon: Zap,
    title: "Rápido y fácil",
    description:
      "Compra tus entradas en segundos con nuestra interfaz optimizada.",
  },
];

export function FeaturesSection() {
  return (
    <section className="section-padding bg-muted/20">
      <div className="container-fluid">
        <div className="text-center mb-12">
          <h2 className="h2 mb-4">La nueva forma de comprar entradas</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre eventos únicos y compra entradas de forma segura y sencilla
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
