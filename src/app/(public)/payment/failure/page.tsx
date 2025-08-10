import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import Link from "next/link";

export default async function PaymentFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ purchase_id: string }>;
}) {
  const { purchase_id } = await searchParams;

  const handleRetry = () => {
    // Si tenemos purchase_id, podríamos redirigir de vuelta al evento
    // Por ahora, simplemente recargamos la página
    window.location.reload();
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="container-fluid py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="text-center">
                <XCircle className="w-20 h-20 text-destructive mx-auto mb-4" />
                <CardTitle className="text-2xl text-destructive">
                  Pago no completado
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  No se pudo procesar tu pago. Esto puede deberse a:
                </p>
                <ul className="text-sm text-muted-foreground text-left space-y-1 max-w-xs mx-auto">
                  <li>• Fondos insuficientes</li>
                  <li>• Problemas con la tarjeta</li>
                  <li>• Conexión interrumpida</li>
                  <li>• Pago cancelado</li>
                </ul>
              </div>

              {purchase_id && (
                <div className="p-3 bg-muted/20 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    ID de compra: {purchase_id}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  No te preocupes, no se realizó ningún cargo
                </p>

                <div className="flex flex-col gap-3">
                  <Button onClick={handleRetry} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Intentar de nuevo
                  </Button>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver al inicio
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  ¿Necesitas ayuda? Contáctanos en{" "}
                  <a
                    href="mailto:soporte@carbonotickets.com"
                    className="text-primary hover:underline"
                  >
                    soporte@carbonotickets.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
