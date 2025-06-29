import Link from "next/link";
import { Button } from "@/modules/shared/components/ui/button";

export function CallToActionSection() {
  return (
    <section className="section-padding bg-gradient-to-r from-carbono-black via-carbono-black-light to-carbono-black">
      <div className="container-narrow text-center">
        <h2 className="h2 text-white mb-4">¿Organizas eventos?</h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Únete a Carbono Tickets y democratiza la venta de entradas. Tanto si
          organizas eventos underground como mainstream, tenemos las
          herramientas que necesitas.
        </p>
        <Button asChild size="lg" className="btn-gradient">
          <Link href="/organizer/register-organizer">
            Comenzar como organizador
          </Link>
        </Button>
      </div>
    </section>
  );
}
