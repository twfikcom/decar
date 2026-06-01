=== Löwe Trucks Inventory ===
Contributors: lowetrucks
Tags: inventory, trucks, cars, rest-api, multilingual
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.4.0
License: GPLv2 or later

Manage Cars, Trucks & Spare parts with DE/EN/AR content and expose a REST API for the Next.js frontend.

== Changelog ==

= 1.4.0 =
* Spare parts post type (image + multilingual title/description).
* REST: `GET /parts?lang=de|en|ar` for the Next.js Parts page (no single-part endpoint).

= 1.3.2 =
* Fix saving gallery image IDs from the vehicle editor (meta was cleared on every save because the POST field was not read).

1. Zip the `lowe-trucks-inventory` folder or upload it to `/wp-content/plugins/`.
2. Activate the plugin in WordPress admin.
3. Go to **Löwe Inventory** in the sidebar.
4. Add trucks under **Add Truck**, cars under **Add Car**, and spare parts under **Add spare part**.
5. For trucks/cars: fill shared specs once (engine, transmission, fuel economy, etc.), then title/description/features in DE, EN, and AR tabs. Admin labels are in English; truck category and brand use predefined lists. The description field supports rich text formatting. Cars use a separate predefined brand list.
6. For spare parts: set **Featured Image**, then title and description in each language tab. Parts appear together on the Next.js `/parts` page only.
7. Set **Vehicle ID** (e.g. `t-001`, `c-001`) — used in Next.js URLs for vehicles. Parts use an optional Part ID (auto `p-{id}`) for reference only.

== REST API ==

Base URL: `{your-site}/wp-json/lowe-trucks/v1/`

* `GET /trucks?lang=de|en|ar`
* `GET /trucks/{id}?lang=de|en|ar`
* `GET /cars?lang=de|en|ar`
* `GET /cars/{id}?lang=de|en|ar`
* `GET /parts?lang=de|en|ar`

== Next.js ==

The Next.js site pulls these endpoints on its own schedule (`WORDPRESS_REVALIDATE_SECONDS`); no WordPress → Next.js webhook is required.

Set in `.env.local`:

```
WORDPRESS_API_URL=https://admin.löwetrucks.de
WORDPRESS_REVALIDATE_SECONDS=60
```

The frontend falls back to mock data when WordPress is unreachable.
