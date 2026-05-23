# WordPress Plugin — Löwe Trucks Inventory

إضافة وردبريس لإدارة **الشاحنات (Trucks)** و**السيارات (Cars)** بثلاث لغات (DE / EN / AR) مع REST API للموقع Next.js.

## التثبيت

1. اضغط مجلد `lowe-trucks-inventory` كـ ZIP أو انسخه إلى:
   `wp-content/plugins/lowe-trucks-inventory/`
2. فعّل الإضافة من **Plugins** في لوحة تحكم وردبريس.
3. ستظهر قائمة **Löwe Inventory** في الشريط الجانبي.

## إضافة منتج

### شاحنة (Truck)
1. **Löwe Inventory → Add Truck**
2. املأ **Vehicle specifications** (ماركة، موديل، سنة، كم، سعر، قوة، حالة، featured، صور).
3. اختر **Truck category** (Sattelzugmaschine، Festaufbau، …).
4. في تبويبات **DE / EN / AR** أدخل العنوان والوصف والميزات (سطر لكل ميزة).
5. حدّد **Vehicle ID** مثل `t-001` — يُستخدم في رابط Next.js `/trucks/t-001`.
6. انشر المنشور (**Publish**).

### سيارة (Car)
نفس الخطوات عبر **Add Car** مع حقول **Body type** و **Fuel**.

## REST API

Base URL:
```
https://admin.löwetrucks.de/wp-json/lowe-trucks/v1/
```

| Endpoint | الوصف |
|----------|--------|
| `GET /trucks?lang=de` | كل الشاحنات بالألمانية |
| `GET /trucks/t-001?lang=en` | شاحنة واحدة بالإنجليزية |
| `GET /cars?lang=ar` | كل السيارات بالعربية |
| `GET /cars/c-001?lang=de` | سيارة واحدة |

## ربط Next.js

في `.env.local`:

```env
WORDPRESS_API_URL=https://admin.löwetrucks.de
WORDPRESS_REVALIDATE_SECONDS=300
```

إذا كان WordPress غير متاح، يعود الموقع تلقائياً إلى البيانات الوهمية (`lib/mock-data.ts`).

## الحقول المشتركة vs المترجمة

| مشترك (لغة واحدة) | مترجم (DE / EN / AR) |
|---------------------|----------------------|
| brand, model, year, mileage, price, power | title |
| condition, category/bodyType/fuel (مفاتيح ألمانية) | description |
| images, featured | features (قائمة) |
