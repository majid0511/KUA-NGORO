import { HeroSection } from "../components/sections/HeroSection";
import { QuickAccessSection } from "../components/sections/QuickAccessSection";
import { AboutSection } from "../components/sections/AboutSection";
import { ServicesSection } from "../components/sections/ServicesSection";
import { MarriageTimelineSection } from "../components/sections/MarriageTimelineSection";
import { NewsSection } from "../components/sections/NewsSection";
import { ActivitiesSection } from "../components/sections/ActivitiesSection";
import { OfficialLinksSection } from "../components/sections/OfficialLinksSection";
import { LocationSection } from "../components/sections/LocationSection";
import { ContactCtaSection } from "../components/sections/ContactCtaSection";

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <QuickAccessSection />
      <AboutSection />
      <ServicesSection />
      <MarriageTimelineSection />
      <NewsSection />
      <ActivitiesSection />
      <OfficialLinksSection />
      <LocationSection />
      <ContactCtaSection />
    </div>
  );
}
