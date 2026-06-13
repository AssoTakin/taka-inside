import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/layout/SiteLayout";
import { fetchPageContent, extractData, extractImage } from "@/lib/api";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageRaw = await fetchPageContent(slug);
  const page = extractData(pageRaw);
  const seo = (page?.seo as Record<string, unknown>) || {};
  return {
    title: (seo.metaTitle as string) || (page?.title as string) || slug,
    description: (seo.metaDescription as string) || '',
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const pageRaw = await fetchPageContent(slug);
  const page = extractData(pageRaw);

  // Si Strapi n'a pas encore de données pour ce slug → afficher page "en construction"
  if (!page) {
    return (
      <SiteLayout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taka-yellow/15 text-taka-yellow text-sm font-medium mb-6">
            ⚙️ Configuration
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Page en cours de configuration
          </h1>
          <p className="text-taka-gray mb-8">
            Cette page sera bientôt disponible. Pour la configurer, connectez-vous à l'admin Strapi et créez une entrée dans "Page Contents" avec le slug <code className="bg-taka-cream px-2 py-1 rounded">{slug}</code>.
          </p>
          <Link href="/" className="text-taka-yellow hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const title = (page.title as string) || 'Page';
  const subtitle = (page.subtitle as string) || '';
  const content = page.content;
  const heroImg = extractImage(page.heroImage);
  const ctas = ((page.ctas as Record<string, unknown>[]) || []).map(extractData).filter(Boolean) as Record<string, unknown>[];

  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero image */}
        {heroImg.url && (
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10">
            <Image src={heroImg.url} alt={heroImg.alt || title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-taka-black/60 to-transparent" />
          </div>
        )}

        <div className="mb-8">
          <Link href="/" className="text-sm text-taka-gray hover:text-taka-yellow transition-colors mb-4 inline-block">
            ← Retour à l'accueil
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold">{title}</h1>
          {subtitle && <p className="text-lg text-taka-gray mt-2">{subtitle}</p>}
        </div>

        {/* Content blocks */}
        <div className="prose prose-lg max-w-none mb-12">
          <StrapiBlocks content={content} />
        </div>

        {/* CTAs */}
        {ctas.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {ctas.map((cta, idx) => (
              <Link
                key={idx}
                href={(cta.link as string) || '/'}
                className={`px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-all ${
                  cta.style === 'primary'
                    ? 'bg-taka-yellow text-taka-black hover:bg-opacity-90'
                    : cta.style === 'outline'
                    ? 'border border-taka-black/30 hover:bg-taka-black/5'
                    : 'bg-taka-black text-white hover:bg-opacity-90'
                }`}
              >
                {(cta.label as string) || 'Action'}
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

export async function generateStaticParams() {
  return [
    { slug: 'association' },
    { slug: 'contact' },
    { slug: 'devenir-benevole' },
    { slug: 'label-musical' },
  ];
}

/* Simple Strapi Blocks renderer — rend le JSON blocks en HTML basique */
function StrapiBlocks({ content }: { content: unknown }) {
  if (!content) return null;
  if (typeof content === 'string') return <div className="whitespace-pre-wrap">{content}</div>;

  // Strapi v5 blocks format
  if (Array.isArray(content)) {
    return (
      <div className="space-y-4">
        {content.map((block: Record<string, unknown>, i: number) => {
          const type = block.type as string;
          const children = block.children as Record<string, unknown>[];

          if (type === 'paragraph') {
            return <p key={i}>{renderText(children)}</p>;
          }
          if (type === 'heading') {
            const level = (block.level as number) || 2;
            const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
            return <Tag key={i} className="font-display font-bold">{renderText(children)}</Tag>;
          }
          if (type === 'list') {
            const isOrdered = block.format === 'ordered';
            const Tag = isOrdered ? 'ol' : 'ul';
            return (
              <Tag key={i} className={isOrdered ? 'list-decimal' : 'list-disc'} style={{ marginLeft: '1.5rem' }}>
                {(children || []).map((item: Record<string, unknown>, j: number) => (
                  <li key={j}>{renderText(item.children as Record<string, unknown>[])}</li>
                ))}
              </Tag>
            );
          }
          if (type === 'quote') {
            return <blockquote key={i} className="border-l-4 border-taka-yellow pl-4 italic">{renderText(children)}</blockquote>;
          }

          return null;
        })}
      </div>
    );
  }

  // Fallback: afficher en JSON
  return <pre className="whitespace-pre-wrap text-sm bg-taka-cream p-4 rounded-lg border overflow-auto">{JSON.stringify(content, null, 2)}</pre>;
}

function renderText(children: Record<string, unknown>[] | undefined): string {
  if (!children) return '';
  return children.map((c) => (c.text as string) || '').join('');
}
