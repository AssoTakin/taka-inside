import fs from 'fs';
import path from 'path';

export default async function FaireUnDonPage() {
  const filePath = path.join(process.cwd(), 'public', 'faire-un-don.html');
  const html = fs.readFileSync(filePath, 'utf-8');

  // On retourne le HTML vanilla en pleine page SANS layout Next.js,
  // pour éviter les erreurs d'hydratation et le double footer.
  return (
    <div className="html-vanilla-page" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export const dynamic = 'force-dynamic';
