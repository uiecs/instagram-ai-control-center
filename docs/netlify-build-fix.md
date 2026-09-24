# رفع خطای Build در Netlify

تنظیمات ریشه پروژه اکنون برای monorepo اصلاح شده است:

- `base = "web"`
- نسخه‌های Next/React/TypeScript ثابت شده‌اند تا نصب Netlify قابل تکرار باشد.
- Node روی نسخه 20 تنظیم شده است.
- `@netlify/plugin-nextjs` در زمان build نصب می‌شود.
- `next.config.ts` و layout تایپ‌شده اضافه شده‌اند.

در Netlify این تنظیمات را دستی override نکنید. اگر قبلاً تنظیمات وارد کرده‌اید، مقدارهای زیر را بررسی کنید:

```text
Base directory: web
Build command: npm run build
Publish directory: .next
Node version: 20
```

پس از commit جدید، از مسیر Deploys گزینه **Clear cache and deploy site** را اجرا کنید.
