import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PagePlaceholder
      title="Reach us"
      note="Call, text, hours, and service area land here shortly."
    />
  );
}
