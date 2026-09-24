'use client';

import { useState } from 'react';

type Tab = 'chat' | 'content' | 'image' | 'search';
const API = process.env.NEXT_PUBLIC_API_URL;

function InstagramMark() {
  return <svg className="instagram-mark" viewBox="0 0 24 24" aria-label="Instagram" role="img"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>('chat');
  const [prompt, setPrompt] = useState('');
  const [out, setOut] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function run() {
    if (!prompt.trim()) return;
    if (!API) { setError('Backend is not configured. Set NEXT_PUBLIC_API_URL in Netlify.'); return; }
    setBusy(true); setOut(null); setError('');
    const path = tab === 'chat' ? '/ai/chat' : tab === 'content' ? '/ai/content' : tab === 'image' ? '/ai/image' : '/search/username';
    try {
      const response = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: prompt.trim(), username: prompt.trim() }) });
      const data: unknown = await response.json();
      if (!response.ok) throw new Error(typeof data === 'object' && data !== null && 'detail' in data ? String((data as { detail: unknown }).detail) : 'Request failed');
      setOut(data);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unexpected error'); }
    finally { setBusy(false); }
  }

  const title = tab === 'chat' ? 'Chat with your AI assistant' : tab === 'content' ? 'Create publish-ready content' : tab === 'image' ? 'Generate an image from a prompt' : 'Public username search';
  const action = tab === 'image' ? 'Generate image' : tab === 'search' ? 'Search publicly' : tab === 'content' ? 'Create content' : 'Send message';
  const dataUrl: string | null = out && typeof out === 'object' && 'data_url' in out ? String((out as { data_url: unknown }).data_url) : null;

  return <main dir="ltr">
    <header><div className="brand"><InstagramMark /> <span>Instagram AI Studio</span></div><span className="pill">Creator dashboard</span></header>
    <div className="layout">
      <aside>
        <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>✦ AI Chat</button>
        <button className={tab === 'content' ? 'active' : ''} onClick={() => setTab('content')}>✧ Content Studio</button>
        <button className={tab === 'image' ? 'active' : ''} onClick={() => setTab('image')}>▣ Image Generator</button>
        <button className={tab === 'search' ? 'active' : ''} onClick={() => setTab('search')}>⌕ Public Search</button>
      </aside>
      <section>
        <div className="hero"><small>ENTER YOUR COMMAND</small><h1>{title}</h1><p>Describe what you need. Review everything before publishing.</p></div>
        <div className="card">
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) void run(); }} placeholder={tab === 'search' ? 'Enter a public username, for example: brand_name' : 'Example: Create a premium caption for an iced coffee launch with relevant hashtags...'} />
          <div className="actions"><button className="primary" disabled={busy || !prompt.trim()} onClick={() => void run()}>{busy ? 'Processing...' : action}</button><button onClick={() => { setPrompt(''); setOut(null); setError(''); }}>Clear</button></div>
          {error && <div className="error">{error}</div>}
          {dataUrl && <img className="generated" src={dataUrl} alt="Generated result" />}
          {out !== null && <pre>{JSON.stringify(out, null, 2)}</pre>}
        </div>
        <div className="card publish"><h2>Safe Publishing</h2><p>Real publishing requires official Meta connection and explicit confirmation.</p><button onClick={() => setTab('content')}>Open content studio</button></div>
      </section>
    </div>
  </main>;
}
