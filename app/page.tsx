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
import { existsSync } from "node:fs";
import path from "node:path";
import {
  WashSequence,
  type StageId,
  type StageImages,
} from "@/components/home/WashSequence";

/**
 * Stage photos are a drop-in: put wash/decontaminate/protect/interior
 * .jpg|.png|.webp into public/stages/ and the wash sequence uses them
 * instead of the illustrated surfaces (docs/stage-image-prompts.md).
 */
function detectStageImages(): StageImages {
  const stages: StageId[] = ["wash", "decontaminate", "protect", "interior"];
  const images = {} as StageImages;
  for (const stage of stages) {
    images[stage] = null;
    for (const ext of ["jpg", "png", "webp"]) {
      if (existsSync(path.join(process.cwd(), "public", "stages", `${stage}.${ext}`))) {
        images[stage] = `/stages/${stage}.${ext}`;
        break;
      }
    }
  }
  return images;
}
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
      <WashSequence images={detectStageImages()} />
      <ShowpieceSlot />
      <BeforeAfterStrip />
      <ServicesOverview />
      <WhyAtBros />
      <ServiceArea />
      <ClosingCta />
    </>
  );
}
