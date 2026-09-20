import { Hero } from "@/components/home/Hero";
import { MotionLayer } from "@/components/home/MotionLayer";
import { AddOns, OurWork, TrustStrip } from "@/components/home/sections";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { BookByText } from "@/components/BookByText";

/**
 * The home page, one scroll: hero, why us, prices, add-ons, the work,
 * and the booking form. Every section reads
 * coherently with zero JavaScript animation; MotionLayer adds reveals on
 * top through the motion-preference gate.
 */
export default function Home() {
  return (
    <>
      <MotionLayer />
      <Hero />
      <TrustStrip />
      <ServicesOverview />
      <AddOns />
      <OurWork />
      <BookByText />
    </>
  );
}
