import { Hero } from "@/components/home/Hero";
import {
  BeforeAfterStrip,
  ClosingCta,
  Problem,
  ProcessChapters,
  ServiceArea,
  ShowpieceSlot,
  WhyAtBros,
} from "@/components/home/sections";
import { ServicesOverview } from "@/components/home/ServicesOverview";

/**
 * The Transformation narrative: a car goes from dirty to finished as you
 * scroll. Every section reads coherently with zero JavaScript animation;
 * ticket #6 layers motion on top through the motion-preference gate.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <ProcessChapters />
      <ShowpieceSlot />
      <BeforeAfterStrip />
      <ServicesOverview />
      <WhyAtBros />
      <ServiceArea />
      <ClosingCta />
    </>
  );
}
