# Deployment guide

## Netlify (frontend)

1. در Netlify گزینه **Add new site → Import an existing project** را انتخاب کنید.
2. مخزن `uiecs/instagram-ai-control-center` و شاخه `main` را انتخاب کنید.
3. فایل `netlify.toml` تنظیمات build را فراهم می‌کند: base=`web` و command=`npm run build`.
4. در Site configuration → Environment variables مقدار زیر را تنظیم کنید:

```text
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-DOMAIN.example.com
```

5. Deploy را اجرا کنید.

## Backend

Netlify محل مناسبی برای اجرای دائمی FastAPI، پردازش WebSocket، PostgreSQL و نگهداری امن توکن‌ها نیست. backend را با Docker روی Render، Railway، Fly.io یا VPS اجرا کنید:

```bash
cp .env.example .env
# کلیدها و توکن‌ها را فقط در Secret/Environment Variables سرویس میزبان بگذارید
docker compose up --build api
```

سپس آدرس backend را در `NEXT_PUBLIC_API_URL` سایت Netlify قرار دهید. مقدار `CORS_ORIGINS` را برابر دامنه Netlify تنظیم کنید و از `*` در محیط production استفاده نکنید.

## وضعیت قابلیت‌ها

- تولید چت، متن و تصویر: با `OPENAI_API_KEY` فعال می‌شود.
- انتشار عکس: با `META_ACCESS_TOKEN` و `META_IG_USER_ID` و مجوزهای رسمی Meta فعال می‌شود و تأیید صریح لازم دارد.
- جست‌وجوی عمومی نام کاربری: با `BRAVE_SEARCH_API_KEY`، محدود به نتایج عمومی وب است.
- Follow/Unfollow غیررسمی عمداً اجرا نمی‌شود؛ ماژول ایزوله فقط وضعیت و هشدار ارائه می‌کند.

توکن‌ها و کلیدها را در Git commit نکنید.
