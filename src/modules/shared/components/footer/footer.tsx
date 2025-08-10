"use client";

import { FC } from "react";
import Link from "next/link";
// import { Separator } from "@/modules/shared/components/ui/separator";
// import { Mail, Twitter, Instagram, Facebook, MapPin, Phone } from "lucide-react";

// TODO: Uncomment when we have real data
// const footerSections = {
//   platform: {
//     title: "Plataforma",
//     links: [
//       { label: "Explorar eventos", href: "/events" },
//       { label: "Categorías", href: "/categories" },
//       { label: "Próximos eventos", href: "/events?filter=upcoming" },
//       { label: "Eventos destacados", href: "/events?filter=featured" },
//     ]
//   },
//   organizers: {
//     title: "Para organizadores",
//     links: [
//       { label: "Vender entradas", href: "/organizer/register-organizer" },
//       { label: "Panel de control", href: "/organizer/dashboard" },
//       { label: "Precios", href: "/pricing" },
//       { label: "Recursos", href: "/resources" },
//     ]
//   },
//   support: {
//     title: "Soporte",
//     links: [
//       { label: "Centro de ayuda", href: "/help" },
//       { label: "Contacto", href: "/contact" },
//       { label: "Estado del servicio", href: "/status" },
//       { label: "Reportar problema", href: "/report" },
//     ]
//   },
//   legal: {
//     title: "Legal",
//     links: [
//       { label: "Términos y condiciones", href: "/terms" },
//       { label: "Política de privacidad", href: "/privacy" },
//       { label: "Política de cookies", href: "/cookies" },
//       { label: "Política de reembolsos", href: "/refunds" },
//     ]
//   }
// };

// TODO: Add real social media links when available
// const socialLinks = [
//   { icon: Twitter, href: "https://twitter.com/carbonotickets", label: "Twitter" },
//   { icon: Instagram, href: "https://instagram.com/carbonotickets", label: "Instagram" },
//   { icon: Facebook, href: "https://facebook.com/carbonotickets", label: "Facebook" },
// ];

// TODO: Add real contact info when available
// const contactInfo = [
//   { icon: Mail, text: "hola@carbonotickets.com", href: "mailto:hola@carbonotickets.com" },
//   { icon: Phone, text: "+54 11 1234-5678", href: "tel:+541112345678" },
//   { icon: MapPin, text: "Buenos Aires, Argentina" },
// ];

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const handleContactClick = () => {
    window.location.href =
      "mailto:info@carbono-14.net?subject=Consulta sobre venta de entradas&body=Hola,%0D%0A%0D%0AEstoy interesado en vender entradas con Carbono Tickets.%0D%0A%0D%0APor favor, contáctenme para más información.%0D%0A%0D%0AGracias!";
  };

  return (
    <footer className="border-t border-border/50 bg-muted/10">
      <div className="container-fluid py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              <div className="flex items-center">
                <span className="font-bold tracking-wider text-foreground">
                  CARBONO
                </span>
                <span className="font-bold tracking-wider text-primary ml-1">
                  14
                </span>
              </div>
            </Link>
            <span>·</span>
            <span>© {currentYear}</span>
          </div>

          {/* Minimal Links - Only what we actually have */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleContactClick}
              className="hover:text-foreground transition-colors cursor-pointer bg-transparent border-none text-sm text-muted-foreground"
            >
              Vender entradas
            </button>
            {/* TODO: Uncomment when pages are created */}
            {/* <Link href="/terms" className="hover:text-foreground transition-colors">
              Términos
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contacto
            </Link> */}
          </div>
        </div>
      </div>

      {/* TODO: Newsletter Section - Implement when we have backend */}
      {/* <div className="bg-muted/20 border-t border-border/50">
        <div className="container-fluid py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">
              Mantente al día con los mejores eventos
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recibe notificaciones sobre nuevos eventos, ofertas especiales y noticias de la plataforma.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              />
              <button
                type="submit"
                className="h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </div> */}
    </footer>
  );
};
