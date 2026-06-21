import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import generatedPosts from '../generated/posts.json';
import products from '../generated/products.json';

const fallbackPosts = [
  {
    title: 'Street art, galleries and collectors: why urban culture keeps entering the mainstream',
    category: 'Street Art',
    region: 'France + USA',
    date: new Date().toISOString().slice(0, 10),
    excerpt: 'Maison Arvella tracks how street culture, contemporary galleries and iconic visual references influence the art market.',
    image: makeSvg('Street Art', '#111827', '#f97316'),
    sources: ['Demo editorial note'],
    status: 'Demo'
  }
];

function makeSvg(text, bg, accent) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="920" cy="140" r="190" fill="rgba(255,255,255,.13)"/><text x="70" y="420" font-size="82" font-family="Arial" font-weight="900" fill="white">${text}</text><text x="74" y="500" font-size="32" font-family="Arial" fill="rgba(255,255,255,.78)">Maison Arvella</text></svg>`)}`;
}

function App() {
  const [tab, setTab] = useState('home');
  const posts = generatedPosts?.length ? generatedPosts : fallbackPosts;
  const featured = posts[0];
  const [localPosts, setLocalPosts] = useState(posts);

  const visibleProducts = useMemo(() => products, []);

  function simulateUpdate() {
    const fresh = {
      title: 'New weekly Arvella story generated in browser demo mode',
      category: 'Automation Demo',
      region: 'France + USA',
      date: new Date().toISOString().slice(0, 10),
      excerpt: 'This local demo shows what the automated weekly robot will do after GitHub Actions and API keys are connected.',
      image: makeSvg('Weekly Update', '#0f172a', '#22c55e'),
      sources: ['Local browser simulation'],
      status: 'Simulated'
    };
    setLocalPosts([fresh, ...localPosts]);
  }

  return <>
    <header className="topbar">
      <button className="brand" onClick={() => setTab('home')}>Maison <b>Arvella</b></button>
      <nav>
        <button onClick={() => setTab('home')}>Home</button>
        <button onClick={() => setTab('news')}>News</button>
        <button onClick={() => setTab('gallery')}>Gallery</button>
        <button onClick={() => setTab('automation')}>Automation</button>
      </nav>
    </header>

    {tab === 'home' && <main>
      <section className="hero">
        <div>
          <p className="kicker">France + USA · Street Art · Iconic Paintings</p>
          <h1>Automated art magazine and curated gallery.</h1>
          <p className="lead">A fast code-based prototype designed to become a real self-updating art site with weekly verified stories, AI visuals, gallery products and future AdSense placements.</p>
          <div className="actions"><button className="primary" onClick={() => setTab('news')}>See articles</button><button onClick={() => setTab('gallery')}>See gallery</button></div>
        </div>
        <img src={featured.image} alt={featured.title} />
      </section>
      <Ad />
      <SectionTitle kicker="Latest feed" title="Fresh from Maison Arvella" />
      <PostGrid posts={localPosts.slice(0, 6)} />
    </main>}

    {tab === 'news' && <main><SectionTitle kicker="Verified art feed" title="Art news and culture" /><PostGrid posts={localPosts} /></main>}

    {tab === 'gallery' && <main><SectionTitle kicker="x5 markup model" title="Curated gallery prototype" /><p className="note">Payments are not active in this test. Later, buttons connect to Stripe Payment Links or Shopify/Printful.</p><div className="grid products">{visibleProducts.map(p => <article className="card product" key={p.name}><img src={p.image} alt={p.name}/><div><p className="kicker">{p.category}</p><h3>{p.name}</h3><p>{p.description}</p><div className="price"><span>Cost: €{p.cost}</span><b>Sell: €{p.price}</b></div><button>Coming soon</button></div></article>)}</div></main>}

    {tab === 'automation' && <main><section className="panel"><div><p className="kicker">Weekly robot</p><h2>How the real automation works</h2><p>Every Monday, GitHub Actions can run the generator, read trusted RSS feeds, reject weak stories, create new posts, update the site and redeploy it automatically.</p><button className="primary" onClick={simulateUpdate}>Simulate weekly update now</button></div><div className="stats"><div><b>2+</b><span>sources preferred</span></div><div><b>x5</b><span>gallery markup model</span></div><div><b>AdSense</b><span>ready placeholder</span></div></div></section></main>}

    <footer>© {new Date().getFullYear()} Maison Arvella · Prototype moving toward automation</footer>
  </>;
}

function SectionTitle({ kicker, title }) { return <section className="section-title"><p className="kicker">{kicker}</p><h2>{title}</h2></section>; }
function Ad() { return <section className="ad">Google AdSense placeholder — activate after Google approval</section>; }
function PostGrid({ posts }) { return <div className="grid cards">{posts.map((post, i) => <article className="card" key={post.title + i}><img src={post.image} alt={post.title}/><div><p className="meta">{post.category} · {post.region} · {post.date}</p><h3>{post.title}</h3><p>{post.excerpt}</p><div className="sources">Sources: {(post.sources || []).slice(0, 3).join(' · ')}</div></div></article>)}</div>; }

createRoot(document.getElementById('root')).render(<App />);
