import { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchPageContent, extractData } from "@/lib/api";
import BenevolePageClient from "./BenevolePageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Devenir Bénévole | Taka Inside",
    description: "Rejoignez l'équipe Taka Inside et participez à nos projets culturels et musicaux au Bénin.",
  };
}

export default async function BenevolePage() {
  const content = await fetchPageContent("devenir-benevole");
  const page = extractData(content);

  return (
    <SiteLayout>
      <BenevolePageClient content={page} />
    </SiteLayout>
  );
}
