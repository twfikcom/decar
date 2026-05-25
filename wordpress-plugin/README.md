# Löwe Trucks Inventory — WordPress Plugin

Manage **Cars**, **Trucks**, and **Spare parts** from WordPress with DE/EN/AR content, media gallery, YouTube video (vehicles), and **REST API** for the Next.js frontend.

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
| `GET /parts?lang=en` | Spare parts for the Next.js `/parts` page (image + title + description; no per-part URL) |

## Add a spare part

1. **Löwe Inventory → Add spare part**
2. **Featured Image** (sidebar) — shown on the website
3. **Spare part text** — title and description in DE / EN / AR
4. **Publish** — items appear together on the Next.js Parts page only

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
