import { Clock, RefreshCw, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import { Badge } from "@/modules/shared/components/ui/badge";
import Link from "next/link";

export default async function PaymentPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase_id: string }>;
}) {
  const { purchase_id } = await searchParams;

  const handleCheckStatus = () => {
    // Recargar la página para verificar el estado
    window.location.reload();
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="container-fluid py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="text-center">
                <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-foreground">
                  Pago pendiente
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-3">
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/15 text-yellow-600"
                >
                  En procesamiento
                </Badge>

                <p className="text-muted-foreground">
                  Tu pago está siendo procesado. Esto puede tomar unos minutos.
                </p>
              </div>

              {purchase_id && (
                <div className="p-3 bg-muted/20 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    ID de compra: {purchase_id}
                  </p>
                </div>
              )}

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      ¿Qué está pasando?
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
                      Algunos métodos de pago (como transferencias bancarias)
                      pueden tomar tiempo en confirmarse. Te notificaremos por
                      email cuando se complete.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleCheckStatus}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Verificar estado
                  </Button>

                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver al inicio
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-2">
                <p className="text-xs text-muted-foreground">
                  ✓ No se realizó ningún cargo aún
                </p>
                <p className="text-xs text-muted-foreground">
                  ✓ Recibirás un email cuando se confirme el pago
                </p>
                <p className="text-xs text-muted-foreground">
                  ¿Problemas? Escríbenos a{" "}
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
