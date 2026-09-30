import { HeroSection } from "@/src/components/sections/HeroSection";
import { TrustedPartners } from "@/src/components/sections/TrustedPartners";
import { UpcomingEvents } from "@/src/components/sections/UpcomingEvents";
import { WhoWeAre } from "@/src/components/sections/WhoWeAre";
import { Chapters } from "@/src/components/sections/Chapters";
import { FlagshipEvents } from "@/src/components/sections/FlagshipEvents";
import { Manifesto } from "@/src/components/sections/Manifesto";
import { PhotoGallery } from "@/src/components/sections/PhotoGallery";
import { Testimonials } from "@/src/components/sections/Testimonials";
import { JoinCommunity } from "@/src/components/sections/JoinCommunity";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <TrustedPartners />
      <UpcomingEvents />
      <WhoWeAre />
      <Chapters />
      <FlagshipEvents />
      <Testimonials />
      <JoinCommunity />
      <Manifesto />
      <PhotoGallery />
    </div>
  );
}
