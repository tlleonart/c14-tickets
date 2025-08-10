"use client";

import { Button } from "@/modules/shared/components/ui/button";

export function CallToActionSection() {
  const handleContactClick = () => {
    window.location.href =
      "mailto:info@carbono-14.net?subject=Consulta sobre organización de eventos&body=Hola,%0D%0A%0D%0AEstoy interesado en organizar eventos con Carbono Tickets.%0D%0A%0D%0APor favor, contáctenme para más información.%0D%0A%0D%0AGracias!";
  };

  return (
    <section className="section-padding bg-gradient-to-r from-carbono-black via-carbono-black-light to-carbono-black">
      <div className="container-narrow text-center">
        <h2 className="h2 text-white mb-4">¿Organizas eventos?</h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Únete a Carbono Tickets y democratiza la venta de entradas. Tanto si
          organizas eventos underground como mainstream, tenemos las
          herramientas que necesitas.
        </p>
        <Button onClick={handleContactClick} size="lg" className="btn-gradient">
          CONTÁCTANOS
        </Button>
      </div>
    </section>
  );
}
