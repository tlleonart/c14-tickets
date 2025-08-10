import { Badge } from "@/modules/shared/components/ui/badge";
import { Button } from "@/modules/shared/components/ui/button";
import { Event } from "@/modules/shared/services/events-services";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface FeaturedCarouselSlideProps {
  slide: Event;
}

export const FeaturedCarouselSlide: FC<FeaturedCarouselSlideProps> = ({
  slide,
}) => {
  const {
    category,
    startDatetime,
    id,
    coverImageUrl,
    locationCity,
    locationName,
    shortDescription,
    slug,
    name,
  } = slide;

  // Formatear la fecha de manera amigable
  const formatEventDate = (dateString: string) => {
    // Parsear la fecha ISO sin conversión de timezone
    // "2025-08-30T22:00:00.000Z" -> mantener 22:00 como está
    const isoDate = dateString.replace("Z", ""); // Quitar la Z para evitar conversión UTC
    const [datePart, timePart] = isoDate.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    // Crear fecha usando los valores exactos sin conversión
    const date = new Date(year, month - 1, day, hour, minute);

    // Opciones para formatear la fecha
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long", // "sábado"
      day: "numeric", // "30"
      month: "long", // "agosto"
      year: "numeric", // "2025"
    };

    const formattedDate = date.toLocaleDateString("es-ES", dateOptions);

    // Formatear hora manualmente para mantener el valor original
    const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    return {
      date: formattedDate,
      time: formattedTime,
    };
  };

  const { date, time } = formatEventDate(startDatetime);

  return (
    <div key={id} className="relative flex-[0_0_100%] w-full h-full">
      <Image
        src={coverImageUrl}
        alt={`${name} Cover Image`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute bottom-15 left-15 text-white z-10">
        <Badge
          variant={"secondary"}
          className="bg-red-500 mb-2 text-black font-semibold rounded-none"
        >
          {category}
        </Badge>
        <h2 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight drop-shadow-md">
          {name}
        </h2>
        <h3 className="text-xl md:text-2xl mb-2 text-gray-200 drop-shadow-md">
          {`${locationName}, ${locationCity}`}
        </h3>
        <p className="text-lg md:text-xl mb-2 text-gray-300 drop-shadow-md capitalize">
          {date}
        </p>
        <p className="text-lg md:text-xl mb-4 text-gray-300 drop-shadow-md">
          {time} hs
        </p>
        <p className="text-lg md:text-xl mb-8 text-gray-300 drop-shadow-md">
          {shortDescription}
        </p>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold p-8 text-lg rounded-none">
          <Link href={`/events/${slug}`}>Comprar entradas</Link>
        </Button>
      </div>
    </div>
  );
};
