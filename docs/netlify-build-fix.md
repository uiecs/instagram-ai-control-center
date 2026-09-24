# Netlify build fix

علت اصلی خطای ساخت در نسخه قبلی، استفاده از `useState` در `app/page.tsx` بدون علامت `'use client'` بود. این فایل اکنون به‌عنوان Client Component علامت‌گذاری و با TypeScript strict سازگار شده است.

تنظیمات Netlify:

```text
Base directory: web
Build command: npm run build
Publish directory: .next
Node version: 20
```

بعد از دریافت کامیت جدید، در Netlify گزینه **Deploys → Trigger deploy → Clear cache and deploy site** را بزنید. اگر در Site settings مقدار دیگری برای Base directory یا Build command ثبت شده، حذف یا با مقادیر بالا جایگزین کنید.
