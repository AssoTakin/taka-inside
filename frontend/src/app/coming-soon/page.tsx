import { Metadata } from "next";
import { fetchPageContent, extractData } from "@/lib/api";
import ComingSoonClient from "./ComingSoonClient";

export async function generateMetadata(): Promise<Metadata> {
  const raw = await fetchPageContent("coming-soon");
  const data = extractData(raw);
  const seo = data?.seo as Record<string, unknown> | undefined;
  return {
    title: String(seo?.metaTitle || "Taka Inside"),
    description: String(seo?.metaDescription || "L'Art au Service de l'Humain"),
  };
}

export default async function ComingSoonPage() {
  const raw = await fetchPageContent("coming-soon");
  const content = extractData(raw);
  return <ComingSoonClient content={content} />;
}
