import { Hero } from "@/components/home/Hero";
import { MotionLayer } from "@/components/home/MotionLayer";
import {
  BeforeAfterStrip,
  ClosingCta,
  Problem,
  ServiceArea,
  ShowpieceSlot,
  WhyAtBros,
} from "@/components/home/sections";
import { WashSequence } from "@/components/home/WashSequence";
import { ServicesOverview } from "@/components/home/ServicesOverview";

/**
 * The Transformation narrative: a car goes from dirty to finished as you
 * scroll. Every section reads coherently with zero JavaScript animation;
 * ticket #6 layers motion on top through the motion-preference gate.
 */
export default function Home() {
  return (
    <>
      <MotionLayer />
      <Hero />
      <Problem />
      <WashSequence />
      <ShowpieceSlot />
      <BeforeAfterStrip />
      <ServicesOverview />
      <WhyAtBros />
      <ServiceArea />
      <ClosingCta />
    </>
  );
}
