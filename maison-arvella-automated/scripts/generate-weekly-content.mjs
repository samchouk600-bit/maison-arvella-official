import fs from 'fs/promises';
import Parser from 'rss-parser';

const parser = new Parser({ timeout: 12000 });
const feeds = [
  'https://www.theartnewspaper.com/rss.xml',
  'https://hyperallergic.com/feed/',
  'https://news.artnet.com/feed'
];

function svgFor(title, category='Art News') {
  const safe = (category || 'Art News').slice(0, 20).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#0f172a"/><circle cx="930" cy="160" r="220" fill="#f97316" opacity=".85"/><circle cx="200" cy="680" r="260" fill="#e11d48" opacity=".55"/><text x="70" y="410" font-family="Arial" font-size="68" font-weight="900" fill="white">${safe}</text><text x="74" y="485" font-family="Arial" font-size="30" fill="#fed7aa">Maison Arvella Weekly</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function clean(text='') { return String(text).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }
function categoryFromTitle(title='') {
  const t = title.toLowerCase();
  if (t.includes('street') || t.includes('mural') || t.includes('banksy')) return 'Street Art';
  if (t.includes('auction') || t.includes('sale') || t.includes('market')) return 'Art Market';
  if (t.includes('museum') || t.includes('exhibition') || t.includes('gallery')) return 'Exhibitions';
  return 'Contemporary Art';
}

async function main() {
  const items = [];
  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      for (const item of feed.items.slice(0, 10)) {
        const title = clean(item.title);
        if (!title) continue;
        items.push({
          title,
          link: item.link,
          source: feed.title || new URL(feedUrl).hostname,
          date: item.isoDate?.slice(0,10) || new Date().toISOString().slice(0,10),
          excerpt: clean(item.contentSnippet || item.summary || item.content || '').slice(0, 220)
        });
      }
    } catch (err) {
      console.warn('Feed failed:', feedUrl, err.message);
    }
  }

  const unique = [];
  const seen = new Set();
  for (const item of items) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 70);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  const posts = unique.slice(0, 8).map(item => {
    const category = categoryFromTitle(item.title);
    return {
      title: item.title,
      category,
      region: 'France + USA',
      date: item.date,
      excerpt: item.excerpt || 'Maison Arvella selected this art story from a recognized cultural source. Full verification and rewriting can be upgraded with an AI API key.',
      image: svgFor(item.title, category),
      sources: [item.source, item.link].filter(Boolean),
      status: 'RSS verified source'
    };
  });

  if (posts.length < 3) {
    console.warn('Not enough RSS posts fetched. Keeping existing generated/posts.json.');
    process.exit(0);
  }

  await fs.writeFile(new URL('../generated/posts.json', import.meta.url), JSON.stringify(posts, null, 2));
  console.log(`Generated ${posts.length} Maison Arvella posts.`);
}

main().catch(err => { console.error(err); process.exit(1); });
