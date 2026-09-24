'use client';

import { useState } from 'react';

type Tab = 'chat' | 'content' | 'image' | 'search';
const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '');

export default function Home() {
  const [tab, setTab] = useState<Tab>('chat');
  const [prompt, setPrompt] = useState('');
  const [out, setOut] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function run() {
    if (!prompt.trim()) return;

    if (!API_URL) {
      setOut(null);
      setError(
        'سرویس backend هنوز متصل نشده است. برای فعال‌شدن این قابلیت، متغیر NEXT_PUBLIC_API_URL را در Netlify تنظیم کنید.'
      );
      return;
    }

    setBusy(true);
    setOut(null);
    setError('');
    const path = tab === 'chat' ? '/ai/chat' : tab === 'content' ? '/ai/content' : tab === 'image' ? '/ai/image' : '/search/username';
    try {
      const response = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), username: prompt.trim() }),
      });
      const contentType = response.headers.get('content-type');
      const data: unknown = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof data === 'object' && data !== null && 'detail' in data
            ? String((data as { detail: unknown }).detail)
            : 'ارتباط با سرویس backend ناموفق بود.'
        );
      }
      setOut(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setBusy(false);
    }
  }

  const title = tab === 'chat' ? 'با دستیار هوشمند گفتگو کن' : tab === 'content' ? 'تولید محتوای آماده انتشار' : tab === 'image' ? 'ساخت تصویر با دستور متنی' : 'جست‌وجوی عمومی نام کاربری';
  const action = tab === 'image' ? 'تولید تصویر' : tab === 'search' ? 'جست‌وجوی عمومی' : 'اجرا';

  return (
    <main dir="rtl">
      <header><div className="brand">✦ استودیو هوش مصنوعی</div><span className="pill">داشبورد سازنده محتوا</span></header>
      <div className="layout">
        <aside>
          <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>◈ چت هوشمند</button>
          <button className={tab === 'content' ? 'active' : ''} onClick={() => setTab('content')}>✦ تولید محتوا</button>
          <button className={tab === 'image' ? 'active' : ''} onClick={() => setTab('image')}>▣ تولید تصویر</button>
          <button className={tab === 'search' ? 'active' : ''} onClick={() => setTab('search')}>⌕ جست‌وجوی عمومی</button>
        </aside>
        <section>
          <div className="hero"><small>فرمان خود را وارد کنید</small><h1>{title}</h1><p>ایده‌ات را بنویس؛ پیش از هر انتشار امکان بازبینی و تأیید داری.</p></div>
          <div className="card">
            {!API_URL && (
              <div className="notice" role="status">
                backend متصل نیست؛ قابلیت‌های هوش مصنوعی و Meta پس از تنظیم
                NEXT_PUBLIC_API_URL فعال می‌شوند.
              </div>
            )}
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) void run(); }} placeholder={tab === 'search' ? 'نام کاربری را وارد کن؛ مثال: brand_name' : 'مثلاً: برای قهوه سرد یک کپشن فارسی لوکس با هشتگ‌های مرتبط بساز...'} />
            <div className="actions"><button className="primary" disabled={busy || !prompt.trim()} onClick={() => void run()}>{busy ? 'در حال پردازش…' : action}</button><button onClick={() => { setPrompt(''); setOut(null); setError(''); }}>پاک کردن</button></div>
            {error && <div className="error">{error}</div>}
            {out !== null && typeof out === 'object' && 'data_url' in out && <img className="generated" src={String((out as { data_url: unknown }).data_url)} alt="تصویر تولیدشده" />}
            {out !== null && <pre>{JSON.stringify(out, null, 2)}</pre>}
          </div>
          <div className="card publish"><h2>انتشار ویژه</h2><p>انتشار واقعی فقط پس از اتصال Meta و تأیید صریح انجام می‌شود.</p></div>
        </section>
      </div>
    </main>
  );
}
