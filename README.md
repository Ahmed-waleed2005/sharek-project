# شارك — منصة التطوع المجتمعي

مشروع متكامل (Backend + Frontend) مبني بـ **NestJS** (يعمل فوق Express) و **MySQL** (عبر TypeORM)،
وواجهة أمامية (HTML/CSS/JS) بتصميم مطابق لتصميم المنصة.

## هيكل المشروع

```
sharek/
├── backend/          # NestJS API (Auth, Users, Categories, Initiatives, Enrollments)
│   └── src/
│       ├── auth/
│       ├── users/
│       ├── categories/
│       ├── initiatives/
│       ├── enrollments/
│       ├── entities/
│       └── database/seed.ts
├── frontend/         # صفحات الموقع (تُخدم تلقائياً من الباك اند)
│   ├── index.html            الرئيسية
│   ├── initiatives.html      قائمة المبادرات
│   ├── initiative-details.html
│   ├── map.html               خريطة المبادرات (Leaflet + OpenStreetMap)
│   ├── create-initiative.html
│   ├── login.html / register.html
│   ├── profile.html / dashboard.html
│   ├── css/style.css
│   └── js/ (api.js, common.js)
└── database/schema.sql  # مرجع SQL يدوي (اختياري، TypeORM ينشئ الجداول تلقائياً)
```

## المتطلبات

- Node.js 18+
- MySQL 8+ (أو MariaDB)

## خطوات التشغيل

### 1) إنشاء قاعدة البيانات
```sql
CREATE DATABASE sharek CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
(أو نفّذ ملف `database/schema.sql` مباشرة)

### 2) إعداد متغيرات البيئة
```bash
cd backend
cp .env.example .env
# عدّل DB_USERNAME / DB_PASSWORD / DB_DATABASE حسب إعدادك
```

### 3) تثبيت الحزم
```bash
npm install
```

### 4) تشغيل الخادم (وضع التطوير)
```bash
npm run start:dev
```
سيعمل الخادم على: `http://localhost:3000`
- الواجهة الأمامية: `http://localhost:3000/index.html`
- الـ API: `http://localhost:3000/api/...`

> `synchronize: true` في وضع التطوير يُنشئ الجداول تلقائياً من الـ Entities عند أول تشغيل — لا حاجة لتنفيذ `schema.sql` يدوياً إلا إذا رغبت بذلك.

### 5) (اختياري) تعبئة بيانات تجريبية
```bash
npm run seed
```
ينشئ 10 أقسام + حساب منظم تجريبي (`organizer@sharek.com` / `password123`) + 6 مبادرات تجريبية.

## أهم نقاط الـ API

| الطريقة | المسار | الوصف | يتطلب توثيق |
|---|---|---|---|
| POST | /api/auth/register | إنشاء حساب | لا |
| POST | /api/auth/login | تسجيل الدخول | لا |
| GET | /api/categories | قائمة الأقسام | لا |
| GET | /api/initiatives | قائمة المبادرات (بحث/فلترة/ترقيم صفحات) | لا |
| GET | /api/initiatives/map | بيانات المبادرات للخريطة | لا |
| GET | /api/initiatives/:id | تفاصيل مبادرة | لا |
| POST | /api/initiatives | إنشاء مبادرة | نعم (منظم) |
| PATCH | /api/initiatives/:id | تعديل مبادرة | نعم (صاحبها) |
| DELETE | /api/initiatives/:id | حذف مبادرة | نعم (صاحبها) |
| POST | /api/initiatives/:id/join | الانضمام لمبادرة | نعم |
| DELETE | /api/initiatives/:id/join | الانسحاب من مبادرة | نعم |
| GET | /api/users/me | بيانات المستخدم الحالي | نعم |
| PATCH | /api/users/me | تعديل الملف الشخصي | نعم |
| GET | /api/users/me/initiatives | مبادرات المستخدم المنضم إليها | نعم |

## ملاحظات

- المصادقة عبر **JWT** (`Authorization: Bearer <token>`)، يُحفظ التوكن في `localStorage` بالواجهة الأمامية.
- كلمات المرور مُشفّرة بـ **bcrypt**.
- الخريطة تستخدم **Leaflet + OpenStreetMap** (مجانية، بدون مفتاح API) بدل خرائط جوجل.
- عند النشر الفعلي: غيّر `synchronize: true` إلى استخدام **migrations**، واستخدم قيمة عشوائية قوية لـ `JWT_SECRET`.
