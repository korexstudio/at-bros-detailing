import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/PagePlaceholder";
import { sellableServices, serviceBySlug } from "@/content";

export function generateStaticParams() {
  return sellableServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const service = serviceBySlug((await params).slug);
  return { title: service ? service.name : "Service" };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = serviceBySlug((await params).slug);
  if (!service || service.addOnFor) notFound();

  return (
    <PagePlaceholder
      title={service.name}
      note={`${service.pitch} Full pricing, what's included, and booking land here shortly.`}
    />
  );
}
