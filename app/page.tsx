import { Hero } from "@/components/home/Hero";
import { MotionLayer } from "@/components/home/MotionLayer";
import {
  BeforeAfterStrip,
  ClosingCta,
  Problem,
  ServiceArea,
  WhyAtBros,
} from "@/components/home/sections";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { BookByText } from "@/components/BookByText";

/**
 * The home page: the problem, the proof, the prices, the booking. Every
 * section reads coherently with zero JavaScript animation; MotionLayer
 * adds reveals on top through the motion-preference gate.
 */
export default function Home() {
  return (
    <>
      <MotionLayer />
      <Hero />
      <Problem />
      <BeforeAfterStrip />
      <ServicesOverview />
      <BookByText />
      <WhyAtBros />
      <ServiceArea />
      <ClosingCta />
    </>
  );
}
