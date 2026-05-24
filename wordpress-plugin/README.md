# Löwe Trucks Inventory — WordPress Plugin

Manage **Cars** and **Trucks** from WordPress with DE/EN/AR content, media gallery, YouTube video, and **REST API** for the Next.js frontend.

The storefront **pulls inventory automatically** from WordPress on a schedule controlled by `WORDPRESS_REVALIDATE_SECONDS` in Next.js — no webhook or cache-sync screen.

## Install

1. Upload `lowe-trucks-inventory.zip` via **Plugins → Add New → Upload**
2. Activate **Löwe Trucks Inventory**

## Add a vehicle

1. **Löwe Inventory → Add Truck** or **Add Car**
2. Set **Featured Image** (sidebar) — main thumbnail on the website (`aspect-[4/3]`)
3. **Thumbnail & gallery** — upload gallery images from the media library
4. **Type-specific fields** — truck **category** (five predefined types with DE/EN/AR labels in the editor) and **brand** from the truck list; cars use **brand** from the car list plus body type and fuel.
5. **YouTube video URL** — e.g. `https://www.youtube.com/watch?v=...`
6. **Multilingual content** tabs — title, description, and **Features & options** (checkboxes) for DE / EN / AR
7. **Publish** — Next.js will pick up changes after the next fetch (see `WORDPRESS_REVALIDATE_SECONDS`)

## REST API

Base: `https://admin.löwetrucks.de/wp-json/lowe-trucks/v1/`

| Endpoint | Description |
|----------|-------------|
| `GET /trucks?lang=de` | All trucks |
| `GET /trucks/{id}?lang=en` | Single truck |
| `GET /cars?lang=ar` | All cars |
| `GET /cars/{id}?lang=de` | Single car |

## Next.js env

```env
WORDPRESS_API_URL=https://admin.löwetrucks.de
WORDPRESS_REVALIDATE_SECONDS=60
APP_URL=https://löwetrucks.de
```

- **`WORDPRESS_REVALIDATE_SECONDS=0`** — fetch fresh data on every request (heavier; use if you need near-instant updates without a webhook).
- **`60`** (default) — Next.js may serve a cached copy for up to 60 seconds after a successful fetch.

Without `WORDPRESS_API_URL`, the site falls back to mock data in `lib/mock-data.ts`.

## Rebuild plugin zip

From repo root (PowerShell):

```powershell
Compress-Archive -Path "wordpress-plugin\lowe-trucks-inventory\*" -DestinationPath "wordpress-plugin\lowe-trucks-inventory.zip" -Force
```
