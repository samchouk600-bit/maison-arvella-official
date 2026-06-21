# Maison Arvella — Automated Site

Vrai prototype code pur pour Maison Arvella : React + Vite + robot hebdomadaire GitHub Actions.

## Test local
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Automatisation
Le fichier `.github/workflows/weekly-content.yml` lance chaque lundi le script :
```bash
npm run generate
```
Il récupère des flux RSS art reconnus et met à jour `generated/posts.json`.

## Important
Cette version ne nécessite pas encore OpenAI. Elle utilise des sources RSS et des visuels SVG automatiques.
Pour une vraie rédaction IA + images IA, ajouter plus tard OPENAI_API_KEY dans GitHub Secrets.

## Boutique
Les paiements ne sont pas actifs. Il faut connecter Stripe Payment Links ou Shopify/Printful.
Ne jamais mettre de RIB dans le code.

## AdSense
Les emplacements sont prêts, mais AdSense doit être activé après acceptation Google.
