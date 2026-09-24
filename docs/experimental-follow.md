# Experimental Follow Module

این پروژه یک بخش ایزوله با نام **Experimental Follow Module** دارد، اما اجرای خودکار follow/unfollow، ورود با `instagrapi`، ذخیره session یا دورزدن محدودیت‌های اینستاگرام در آن پیاده‌سازی نشده است.

دلیل: API رسمی Meta این عملیات را ارائه نمی‌کند و استفاده از کلاینت غیررسمی برای فالو/آنفالو می‌تواند باعث قفل‌شدن حساب، افشای نشست ورود و نقض قوانین پلتفرم شود. پذیرش مسئولیت توسط کاربر این ریسک را به یک قابلیت امن تبدیل نمی‌کند.

Endpoint وضعیت:

```http
GET /experimental-follow/status
```

Endpoint اجرای آزمایشی عمداً با `501 Not Implemented` پاسخ می‌دهد:

```http
POST /experimental-follow/execute
Content-Type: application/json

{
  "target_username": "example",
  "action": "follow",
  "acknowledge_risk": true,
  "second_confirmation": true
}
```

جایگزین قابل استفاده: اتصال OAuth رسمی Meta برای انتشار محتوا، مدیریت کامنت‌ها و Insights در محدوده دسترسی‌های تأییدشده، به‌همراه تأیید دو مرحله‌ای برای عملیات حساس.
