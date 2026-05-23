=== Löwe Trucks Inventory ===
Contributors: lowetrucks
Tags: inventory, trucks, cars, rest-api, multilingual
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later

Manage Cars & Trucks with DE/EN/AR content and expose a REST API for the Next.js frontend.

== Installation ==

1. Zip the `lowe-trucks-inventory` folder or upload it to `/wp-content/plugins/`.
2. Activate the plugin in WordPress admin.
3. Go to **Löwe Inventory** in the sidebar.
4. Add trucks under **Add Truck** and cars under **Add Car**.
5. Fill shared specs once, then title/description/features in DE, EN, and AR tabs.
6. Set **Vehicle ID** (e.g. `t-001`, `c-001`) — used in Next.js URLs.

== REST API ==

Base URL: `{your-site}/wp-json/lowe-trucks/v1/`

* `GET /trucks?lang=de|en|ar`
* `GET /trucks/{id}?lang=de|en|ar`
* `GET /cars?lang=de|en|ar`
* `GET /cars/{id}?lang=de|en|ar`

== Next.js ==

Set in `.env.local`:

```
WORDPRESS_API_URL=https://admin.löwetrucks.de
WORDPRESS_REVALIDATE_SECONDS=300
```

The frontend falls back to mock data when WordPress is unreachable.
