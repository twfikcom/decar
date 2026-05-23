# نشر الموقع على Hostinger Node.js

دليل نشر مشروع **Löwe Trucks** (Next.js 15) على **Hostinger → Node.js Web Apps**.

## المتطلبات

- خطة Hostinger Business أو Cloud مع **Node.js Web Apps**
- مستودع GitHub: [github.com/twfikcom/decar](https://github.com/twfikcom/decar)
- Node.js **20.x** (موصى به)

---

## 1) إنشاء التطبيق في hPanel

1. ادخل **hPanel → Websites → Add Website**
2. اختر **Node.js Apps**
3. اختر **Import Git Repository**
4. اربط GitHub واختر مستودع `decar`
5. الفرع: `main`

---

## 2) إعدادات البناء (Build settings)

| الحقل | القيمة |
|--------|--------|
| **Install command** | `npm ci` |
| **Build command** | `npm run build` |
| **Start command** | `npm start` |
| **Node.js version** | `20` |
| **Framework** | Next.js (يُكتشف تلقائياً) |
| **Output directory** | `.next` |

> لا تستخدم `next export` — الموقع يحتاج SSR (صفحات ديناميكية + WordPress API).  
> **لا تستخدم** `output: standalone` — Hostinger يعمل مع `next start` فقط.

---

## 3) متغيرات البيئة (Environment variables)

أضفها في **hPanel → Node.js App → Environment variables**:

```env
NODE_ENV=production
APP_URL=https://löwetrucks.de
WORDPRESS_API_URL=https://admin.löwetrucks.de
WORDPRESS_REVALIDATE_SECONDS=60
```

> **ملاحظة IDN:** `löwetrucks.de` = `xn--lwetrucks-07a.de` — نفس الدومين. المتصفح يعرض Unicode لكن السيرفر يستخدم punycode داخلياً. هذا طبيعي.

اختياري:

```env
GEMINI_API_KEY=your-key-if-needed
REVALIDATE_SECRET=نفس-القيمة-في-WordPress-Next.js-Sync
```

> **REVALIDATE_SECRET**: أنشئ سلسلة عشوائية طويلة. أضفها في Hostinger **و** في WordPress:  
> **Löwe Inventory → Next.js Sync**

---

## 4) النشر

1. اضغط **Deploy**
2. انتظر اكتمال البناء (Build succeeded)
3. افتح الموقع من الرابط المعطى أو اربط الدomain `löwetrucks.de`

---

## 5) بعد النشر — مهم جداً

### امسح الكاش
- من hPanel: **Cache Manager** أو **LiteSpeed Cache** → **Purge All**
- **عطّل** Page Cache / LiteSpeed لموقع Node.js — Next.js لا يعمل مع كاش HTML قديم
- بعد كل نشر: Purge All ثم افتح في نافذة خاصة

### روابط اللغات (بعد آخر تحديث)
| اللغة | الرابط |
|--------|--------|
| Deutsch | `https://löwetrucks.de/de` |
| English | `https://löwetrucks.de/en` |
| العربية | `https://löwetrucks.de/ar` |

`/` يُوجّه تلقائياً إلى `/de`

### تحقق من الموقع
- افتح `https://löwetrucks.de` في **نافذة خاصة**
- يجب أن ترى الصفحة العادية، **وليس** نصاً يبدأ بـ `1:"$Sreact.fragment"`

### DNS للدومين
| النوع | الاسم | القيمة |
|--------|--------|--------|
| A | `@` | IP الخادم من Hostinger |
| CNAME | `www` | `@` أو حسب تعليمات Hostinger |

---

## 6) WordPress (المنتجات)

1. ارفع إضافة `wordpress-plugin/lowe-trucks-inventory` إلى WordPress على  
   `https://admin.löwetrucks.de`
2. فعّل الإضافة وأضف الشاحنات/السيارات
3. تأكد أن هذا الرابط يعمل في المتصفح:  
   `https://admin.löwetrucks.de/wp-json/lowe-trucks/v1/trucks?lang=de`

---

## 7) إعادة النشر بعد تحديث GitHub

Hostinger يعيد البناء تلقائياً عند push إلى `main` (إن كان Git deploy مفعّلاً).

يدوياً: **hPanel → Node.js App → Redeploy**

---

## استكشاف الأخطاء

| المشكلة | الحل |
|---------|------|
| صفحة RSC خام (نص `react.fragment`) | امسح الكاش + أعد النشر من آخر commit |
| Build failed | تحقق من Node 20 و `npm run build` محلياً |
| المنتجات لا تظهر من WordPress | تحقق من `WORDPRESS_API_URL` و REST API |
| الصور لا تظهر | أضف hostname الصورة في `next.config.ts` → `images.remotePatterns` |
| المنفذ (Port) | Hostinger يضبط `PORT` تلقائياً — `npm start` يقرأه من `package.json` |

---

## اختبار محلي (قبل النشر)

```bash
npm ci
npm run build
npm run start -- -p 3000
```

ثم افتح: [http://localhost:3000](http://localhost:3000)
