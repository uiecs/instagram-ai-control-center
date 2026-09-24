'use client';

import { FormEvent, useState } from 'react';

type View = 'chat' | 'commands' | 'content' | 'image' | 'search';
type Message = { role: 'user' | 'assistant'; text: string };
const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

function InstagramMark() {
  return <svg className="instagram-mark" viewBox="0 0 24 24" aria-label="Instagram" role="img"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>;
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
    const path = view === 'chat' || view === 'commands' ? '/ai/chat' : view === 'content' ? '/ai/content' : view === 'image' ? '/ai/image' : '/search/username';
    if (view === 'chat') setMessages((items) => [...items, { role: 'user', text: value }]);
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
  const resultImageUrl: string | null = result && typeof result === 'object' && result !== null && 'data_url' in result ? String((result as { data_url: unknown }).data_url) : null;
  const hasResult = result !== null && result !== undefined;
  const resultJson = hasResult ? JSON.stringify(result, null, 2) ?? '' : '';

  return <main dir="ltr"><header><div className="brand"><InstagramMark /><span>Instagram AI Studio</span></div><span className="pill">Creator dashboard</span></header><div className="layout"><aside>
    <button className={view === 'chat' ? 'active' : ''} onClick={() => setView('chat')}>✦ AI chat</button>
    <button className={view === 'commands' ? 'active' : ''} onClick={() => setView('commands')}>⌘ Command console</button>
    <button className={view === 'content' ? 'active' : ''} onClick={() => setView('content')}>✧ Content studio</button>
    <button className={view === 'image' ? 'active' : ''} onClick={() => setView('image')}>▣ Image generator</button>
    <button className={view === 'search' ? 'active' : ''} onClick={() => setView('search')}>⌕ Deep username search</button>
  </aside><section><div className="hero"><small>{view === 'search' ? 'PUBLIC WEB DISCOVERY' : 'AI WORKSPACE'}</small><h1>{titles[view]}</h1><p>{view === 'search' ? 'Search indexed public web results. This cannot guarantee every Instagram account.' : 'Use the chat for conversation or the separate command console for structured instructions.'}</p></div>
    {view === 'chat' && <div className="card chat-log">{messages.length === 0 && <div className="empty">Start a conversation with your configured AI backend.</div>}{messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.role}-${index}`}><b>{message.role === 'user' ? 'You' : 'AI assistant'}</b><p>{message.text}</p></div>)}</div>}
    <form className="card" onSubmit={submit}><textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder={placeholders[view]} /><div className="actions"><button className="primary" disabled={busy || !input.trim()}>{busy ? 'Processing...' : view === 'chat' ? 'Send message' : view === 'commands' ? 'Run command' : view === 'content' ? 'Create content' : view === 'image' ? 'Generate image' : 'Search public results'}</button><button type="button" onClick={() => { setInput(''); setResult(null); setError(''); if (view === 'chat') setMessages([]); }}>Clear</button></div>{error && <div className="error">{error}</div>}{resultImageUrl && <img className="generated" src={resultImageUrl} alt="Generated result" />}{hasResult && <pre>{resultJson}</pre>}</form>
    <div className="card publish"><h2>Safe publishing</h2><p>Official Meta connection and explicit confirmation are required before publishing.</p></div>
  </section></div></main>;
}
