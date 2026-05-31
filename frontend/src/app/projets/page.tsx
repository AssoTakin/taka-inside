import { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchStrapiList } from "@/lib/api";
import ProjectGrid from "./ProjectGrid";

export const metadata: Metadata = {
  title: "Nos Projets",
  description: "Découvrez les projets culturels, musicaux et sociaux de Taka Inside au Bénin.",
};

export default async function ProjetsPage() {
  const projetsData = await fetchStrapiList("projets?populate=*");
  const projets = projetsData && Array.isArray(projetsData) ? projetsData : [];

  return (
    <SiteLayout>
      <ProjectGrid projets={projets as Array<Record<string, unknown>>} />
    </SiteLayout>
  );
}
