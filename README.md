# Instagram AI Control Center

داشبورد RTL فارسی برای تولید محتوای اینستاگرام و اتصال به قابلیت‌های مجاز Meta.

## استقرار نهایی

- راهنمای کامل Netlify و backend: [`docs/netlify-deployment.md`](docs/netlify-deployment.md)
- مخزن: https://github.com/uiecs/instagram-ai-control-center
- frontend روی Netlify و backend FastAPI روی یک سرویس Docker جداگانه اجرا می‌شود.

```bash
cp .env.example .env
docker compose up --build
```

## قابلیت‌های عملیاتی

- چت و تولید محتوای فارسی با OpenAI API
- تولید تصویر با OpenAI Images API
- پیش‌نمایش و انتشار عکس از طریق Instagram Graph API رسمی پس از تأیید صریح
- جست‌وجوی عمومی وب برای نام کاربری، بدون ادعای کشف قطعی همه حساب‌ها
- ماژول Follow/Unfollow غیررسمی فقط به‌صورت غیرفعال و هشداردهنده

## نکات مهم استقرار

OpenAI/Meta/Brave keys را در GitHub یا frontend قرار ندهید؛ آن‌ها فقط به‌عنوان secret در backend تنظیم شوند. برای production مقدار `CORS_ORIGINS` را دقیقاً برابر دامنه Netlify بگذارید.
