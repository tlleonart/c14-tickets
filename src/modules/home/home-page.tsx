import { FC } from "react";
import { FeaturesSection } from "./components/features-section";
import { CallToActionSection } from "./components/call-to-action-section";
import { EventsSection } from "./components/events-section";
import { HeroSection } from "./components/hero-section";

export const Home: FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <EventsSection />
      <FeaturesSection />
      <CallToActionSection />
    </div>
  );
};
