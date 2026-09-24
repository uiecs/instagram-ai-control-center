'use client';

import { FormEvent, useState } from 'react';

type View = 'chat' | 'commands' | 'content' | 'image' | 'search';
type Message = { role: 'user' | 'assistant'; text: string };
const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
const COMPOSIO_URL = process.env.NEXT_PUBLIC_COMPOSIO_DASHBOARD_URL || 'https://dashboard.composio.dev';

const friendlyWelcome = 'سلام شیوا جان، خوبی؟ چه خبر؟ چه اجراهایی می‌خوای روی اکانت پیج انجام بدم برات؟ انتشار پست، نوشتن کپشن و هشتگ، یا آماده‌سازی استوری؟';

function InstagramMark() {
  return <svg className="instagram-mark" viewBox="0 0 24 24" aria-label="Instagram" role="img"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>;
}

function isGreeting(value: string) {
  return /^(سلام|درود|های|هلو|hello|hi|hey)\b?[!؟?.،\s]*$/iu.test(value.trim());
}

async function post(path: string, body: Record<string, string>) {
  if (!API) throw new Error('Backend is not configured. Set NEXT_PUBLIC_API_URL in Netlify and redeploy.');
  const response = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data: unknown = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof data === 'object' && data !== null && 'detail' in data ? String((data as { detail: unknown }).detail) : 'The backend request failed.');
  return data;
}

export default function Home() {
  const [view, setView] = useState<View>('chat');
  const [collapsed, setCollapsed] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const value = input.trim();
    if (!value || busy) return;
    setBusy(true); setError(''); setResult(null);
    if (view === 'chat') setMessages((items) => [...items, { role: 'user', text: value }]);

    // Give Shiwa the requested warm first greeting without requiring the backend.
    if (view === 'chat' && messages.length === 0 && isGreeting(value)) {
      setMessages((items) => [...items, { role: 'assistant', text: friendlyWelcome }]);
      setInput('');
      setBusy(false);
      return;
    }

    const path = view === 'chat' || view === 'commands' ? '/ai/chat' : view === 'content' ? '/ai/content' : view === 'image' ? '/ai/image' : '/search/username';
    try {
      const data = await post(path, view === 'search' ? { username: value, prompt: value } : { prompt: value });
      if (view === 'chat') setMessages((items) => [...items, { role: 'assistant', text: typeof data === 'object' && data !== null && 'text' in data ? String((data as { text: unknown }).text) : JSON.stringify(data) }]);
      else setResult(data);
      setInput('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unexpected error.'); }
    finally { setBusy(false); }
  }

  const titles: Record<View, string> = { chat: 'Chat with your AI assistant', commands: 'Command console', content: 'Create publish-ready content', image: 'Generate an image from a prompt', search: 'Deep public username search' };
  const placeholders: Record<View, string> = { chat: 'Ask your AI assistant anything...', commands: 'Example: Create a caption and 12 relevant hashtags...', content: 'Example: Create a premium caption for an iced coffee launch...', image: 'Example: A cinematic product photo of iced coffee...', search: 'Enter an Instagram username, without @' };

  function selectView(next: View) {
    setView(next);
    if (window.innerWidth < 800) setCollapsed(true);
  }

  return <main className={collapsed ? 'sidebar-collapsed' : ''} dir="ltr">
    <header><button className="dashboard-toggle" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle dashboard">☰</button><div className="brand"><InstagramMark /><span>ιɴѕтαɢrαм αι coɴтrol ceɴтer ѕнιwα</span></div><span className="pill">Creator dashboard</span></header>
    <div className="layout">
      <aside className="sidebar-panel">
        <div className="sidebar-heading"><span>Dashboard</span><button className="collapse-button" onClick={() => setCollapsed(true)} aria-label="Collapse dashboard">‹</button></div>
        <button className={view === 'chat' ? 'active' : ''} onClick={() => selectView('chat')}><span>▱</span><label>AI chat</label></button>
        <button className={view === 'commands' ? 'active' : ''} onClick={() => selectView('commands')}><span>⌘</span><label>Command console</label></button>
        <button className={view === 'content' ? 'active' : ''} onClick={() => selectView('content')}><span>✧</span><label>Content studio</label></button>
        <button className={view === 'image' ? 'active' : ''} onClick={() => selectView('image')}><span>▣</span><label>Image generator</label></button>
        <button className={view === 'search' ? 'active' : ''} onClick={() => selectView('search')}><span>⌕</span><label>Deep username search</label></button>
        <button onClick={() => window.open(COMPOSIO_URL, '_blank', 'noopener,noreferrer')}><span>◎</span><label>Connect Instagram</label></button>
      </aside>
      <section className="workspace"><div className="hero"><small>{view === 'search' ? 'PUBLIC WEB DISCOVERY' : 'AI WORKSPACE'}</small><h1>{titles[view]}</h1><p>{view === 'search' ? 'Search indexed public web results. This cannot guarantee every Instagram account.' : 'Use the chat for conversation or the separate command console for structured instructions.'}</p></div>
        <div className="composio-card"><div><strong>Instagram connection</strong><span>Manage the official connection securely with Composio.</span></div><button onClick={() => window.open(COMPOSIO_URL, '_blank', 'noopener,noreferrer')}>Open Composio</button></div>
        {view === 'chat' && <div className="card chat-log">{messages.length === 0 && <div className="empty">Start a conversation with your configured AI backend.</div>}{messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.role}-${index}`}><b>{message.role === 'user' ? 'You' : 'AI assistant'}</b><p>{message.text}</p></div>)}</div>}
        <form className="card command-card" onSubmit={submit}><textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder={placeholders[view]} /><div className="actions"><button className="primary" disabled={busy || !input.trim()}>{busy ? 'Processing...' : view === 'chat' ? 'Send message' : view === 'commands' ? 'Run command' : view === 'content' ? 'Create content' : view === 'image' ? 'Generate image' : 'Search public results'}</button><button type="button" onClick={() => { setInput(''); setResult(null); setError(''); if (view === 'chat') setMessages([]); }}>Clear</button></div>{error && <div className="error">{error}</div>}{result && typeof result === 'object' && result !== null && 'data_url' in result && <img className="generated" src={String((result as { data_url: unknown }).data_url)} alt="Generated result" />}{result && <pre>{JSON.stringify(result, null, 2)}</pre>}</form>
        <div className="card publish"><h2>Safe publishing</h2><p>Official Meta connection and explicit confirmation are required before publishing.</p></div>
      </section>
    </div>
  </main>;
}
