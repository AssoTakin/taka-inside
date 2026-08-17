import { Metadata } from "next";
import { fetchPageContent, extractData } from "@/lib/api";
import BenevoleForm from "./BenevoleForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const raw = await fetchPageContent("devenir-benevole");
  const data = extractData(raw);
  const seo = data?.seo as Record<string, unknown> | undefined;
  return {
    title: String(seo?.metaTitle || "Devenir Bénévole"),
    description: String(seo?.metaDescription || "Rejoignez l'équipe Taka Inside."),
  };
}

export default async function BenevolePage() {
  const raw = await fetchPageContent("devenir-benevole");
  const content = extractData(raw);

  return <BenevoleForm content={content} />;
}
