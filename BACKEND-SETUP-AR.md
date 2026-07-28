# تشغيل NØIR BEAN
1. انسخ `.env.example` إلى `.env.local` وضع كلمة مرور MySQL الصحيحة.
2. نفّذ `npm install` لإضافة mysql2 وباقي الحزم.
3. قاعدة البيانات والجداول والمنتجات التي تم إدخالها في Workbench متوافقة مع الكود.
4. شغّل `npm run dev` ثم افتح `/api/health`؛ يجب أن تظهر `database: connected`.
5. ضع رابط الدومين الحقيقي في `NEXT_PUBLIC_SITE_URL` قبل النشر حتى تظهر معاينة NØIR BEAN عند مشاركة الرابط.

## المسارات المتاحة
- GET `/api/products`, `/api/categories`
- POST `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- GET `/api/auth/me`
- GET/POST/DELETE `/api/favorites`
- GET/POST `/api/orders`
- GET `/api/admin/orders`, PATCH `/api/admin/orders/:id`, GET `/api/admin/stats`

## إضافات النسخة المحسّنة
- API للملف الشخصي وتغيير البيانات وكلمة المرور.
- API كوبونات مع التحقق من تاريخ الصلاحية والحد الأدنى وحد الاستخدام.
- Chat API يقرأ المنتجات والأسعار مباشرة من MySQL.
- Admin Products API للإضافة والتعديل والإخفاء.
- Admin Settings API لإعدادات النشاط.
- جداول coupons وreviews وsite_settings وaudit_logs.
- صفحة الطلبات متصلة بحساب العميل وصفحة الحساب متصلة بالباك.

## تنبيه النشر
قبل النشر الفعلي غيّر AUTH_SECRET وADMIN_PASSWORD، واضبط NEXT_PUBLIC_SITE_URL على الدومين الحقيقي، وشغّل database.sql على قاعدة الإنتاج. يوصى أيضًا بوضع Cloudflare أو خدمة Rate Limiting أمام مسارات تسجيل الدخول والشات.
