import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <PagePlaceholder
      title="The work"
      note="Before/After comparisons and finished cars land here shortly."
    />
  );
}
