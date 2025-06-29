import { Skeleton } from "@/modules/shared/components/ui/loading";

export function EventDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container-fluid py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cover Image */}
            <Skeleton className="w-full aspect-video rounded-lg" />

            {/* Event Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" /> {/* Category badge */}
                <Skeleton className="h-12 w-3/4" /> {/* Title */}
                <Skeleton className="h-6 w-full" /> {/* Short description */}
              </div>

              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" /> {/* "Sobre el Evento" */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Ticket Selector */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-56" /> {/* "Seleccionar Entradas" */}
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-border rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="space-y-2 text-right">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-40" />
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-6 w-6" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border border-border rounded-lg p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" /> {/* Title */}
                  {/* Event info */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  {/* Divider */}
                  <Skeleton className="h-px w-full" />
                  {/* Ticket summary area */}
                  <div className="text-center py-8">
                    <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                  </div>
                  {/* Status badge */}
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
