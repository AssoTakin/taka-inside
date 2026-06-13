export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';

export default async function FaireUnDonPage() {
  const filePath = path.join(process.cwd(), 'public', 'faire-un-don.html');
  const html = fs.readFileSync(filePath, 'utf-8');
  
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
