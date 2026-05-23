# Löwe Trucks Inventory — WordPress Plugin

Manage **Cars** and **Trucks** from WordPress with DE/EN/AR content, media gallery, YouTube video, and REST API for the Next.js frontend.

## Install

1. Upload `lowe-trucks-inventory.zip` via **Plugins → Add New → Upload**
2. Activate **Löwe Trucks Inventory**
3. Open **Löwe Inventory → Next.js Sync** and set:
   - **Frontend URL:** `https://löwetrucks.de`
   - **Revalidate secret:** same value as `REVALIDATE_SECRET` on Hostinger

## Add a vehicle

1. **Löwe Inventory → Add Truck** or **Add Car**
2. Set **Featured Image** (sidebar) — main thumbnail on the website (`aspect-[4/3]`)
3. **Thumbnail & gallery** — upload gallery images from the media library
4. **YouTube video URL** — e.g. `https://www.youtube.com/watch?v=...`
5. **Multilingual content** tabs — title, description, and **Features & options** (checkboxes) for DE / EN / AR
6. Publish — the site updates within ~60 seconds (or instantly via revalidate webhook)

## REST API

Base: `https://admin.löwetrucks.de/wp-json/lowe-trucks/v1/`

| Endpoint | Description |
|----------|-------------|
| `GET /trucks?lang=de` | All trucks |
| `GET /trucks/{id}?lang=en` | Single truck |
| `GET /cars?lang=ar` | All cars |
| `GET /cars/{id}?lang=de` | Single car |

## Next.js env (Hostinger)

```env
WORDPRESS_API_URL=https://admin.löwetrucks.de
WORDPRESS_REVALIDATE_SECONDS=60
REVALIDATE_SECRET=your-shared-secret
APP_URL=https://löwetrucks.de
```

Without `WORDPRESS_API_URL`, the site falls back to mock data in `lib/mock-data.ts`.

## Rebuild plugin zip

From repo root (requires zip CLI):

```bash
cd wordpress-plugin/lowe-trucks-inventory
zip -r ../lowe-trucks-inventory.zip .
```
