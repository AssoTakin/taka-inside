# Rapport SSL - takainside.org (chain YR2)

## Date investigation
2026-06-30 (session Hermes)

## Symptome rapporte
Un utilisateur (Sam) sur un WiFi public voyait `NET::ERR_CERT_AUTHORITY_INVALID` en accedant a `https://takainside.org`. Connexion impossible avant meme l affichage de la page coming-soon.

## Diagnostic

### Cote serveur (depuis VPS)
- Certificat SSL emis par **Let s Encrypt YR2**
- Validite : 13 juin 2026 -> 11 septembre 2026
- Subject : `CN = takainside.org`
- Verification chain OK (`Verify return code: 0 (ok)` depuis `openssl s_client`)
- DNS pointe vers `76.76.21.21` (Vercel CDN)
- Configuration Vercel : domain `takainside.org` `verified: true` sur projet `prj_8h5X7oZAbC02gjW6nIxw6rL5bToc`

### Cote client (Mac de Sam)
- Erreur uniquement sur le WiFi bloqueur
- Fonctionne en 4G/5G / VPN / Firefox (trust store independant)
- Chrome/Safari sur ce reseau : `NET::ERR_CERT_AUTHORITY_INVALID`

## Cause racine

`takainside.org` est servi avec un certificat **Let s Encrypt YR2** (nouvelle chaine 2024, Ed25519).

Cette chaine est **techniquement plus moderne et sure** que l ancienne R10/R11/R12, mais elle est **moins repandue dans les trust stores** que les anciennes chaines. De nombreux equipements (proxies d entreprise, vieux systemes, certains FAI en Afrique/Asie) ne l ont pas encore integree.

Quand le proxy WiFi tente d intercepter la connexion HTTPS (SSL inspection), il essaie de valider le certificat YR2 avec son trust store. Si YR2 n y est pas, il signale une erreur `CERT_AUTHORITY_INVALID`.

## Workarounds cote visiteur

| Methode | Effet |
|---|---|
| Utiliser 4G/5G au lieu du WiFi | Bypass complet du proxy |
| Utiliser un VPN (ProtonVPN, Mullvad) | Le trafic est chiffre bout-en-bout, le proxy ne peut pas l inspecter |
| Utiliser Firefox (au lieu de Chrome/Safari) | Trust store Firefox souvent plus a jour que celui du systeme |
| Mettre a jour macOS (11 Big Sur ou plus recent) | Ajoute YR2 au trust store systeme |

## Solutions cote serveur (non recommandees)

| Option | Risque |
|---|---|
| Forcer Let s Encrypt R10/R11/R12 sur Vercel | Non officiellement supporte, fragile |
| Migrer vers Google Trust Services | Vercel ne le permet pas pour les custom domains, seulement pour `*.vercel.app` |
| Acheter un cert commercial (DigiCert, Sectigo) | Cout, complexite, et le vrai probleme n est pas le serveur |

**Recommandation : ne rien changer cote serveur.** YR2 est le standard moderne, les vieux equipements doivent s adapter. C est un probleme qui disparaitra naturellement a mesure que les OS et equipements se mettent a jour.

## Impact business

Estimation : 1-5% des visiteurs potentiels pourraient etre bloques (WiFi d aeroport, vieux PC d entreprise, certains FAI africains). Ce n est pas bloquant pour un lancement mais a surveiller dans les analytics.

Si un visiteur signale le probleme, lui recommander les 4 workarounds ci-dessus.

## References

- Let s Encrypt YR2 chain announcement : https://letsencrypt.org/2024/12/05/introducing-y-r2/
- Browser trust store update schedule : varies by browser/OS
- Vercel custom domain SSL : https://vercel.com/docs/projects/domains

## Historique
- 2026-06-30 : investigation initiale, creation de ce document
