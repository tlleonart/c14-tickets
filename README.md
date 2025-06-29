This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
c14-tickets
├─ components.json
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ migrations
│  │  ├─ 20250606171615_first_migration
│  │  │  └─ migration.sql
│  │  ├─ 20250606171811_first_migration
│  │  │  └─ migration.sql
│  │  ├─ 20250606184101_first_migration
│  │  │  └─ migration.sql
│  │  ├─ 20250606184848_first_migration
│  │  │  └─ migration.sql
│  │  ├─ 20250618094950_new_db
│  │  │  └─ migration.sql
│  │  ├─ 20250618101900_add_featured_events
│  │  │  └─ migration.sql
│  │  ├─ 20250618115208_add_location_cities_and_placae
│  │  │  └─ migration.sql
│  │  ├─ 20250618115420_add_location_cities_and_place_required
│  │  │  └─ migration.sql
│  │  ├─ 20250618122352_add_location_cities_and_plce_venue
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ public
│  ├─ dummy-bs.jpg
│  ├─ dummy-vertical.svg
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (protected)
│  │  ├─ (public)
│  │  │  ├─ events
│  │  │  │  └─ [slug]
│  │  │  │     └─ page.tsx
│  │  │  └─ page.tsx
│  │  ├─ api
│  │  │  ├─ events
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [slug]
│  │  │  │     └─ route.ts
│  │  │  ├─ ticket-types
│  │  │  │  └─ [ticketTypeId]
│  │  │  │     └─ sale-phases
│  │  │  │        └─ route.ts
│  │  │  └─ webhooks
│  │  │     └─ clerk
│  │  │        └─ route.ts
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ organizer
│  │  │  └─ register-organizer
│  │  │     └─ page.tsx
│  │  └─ sell-tickets
│  ├─ generated
│  ├─ middleware.ts
│  └─ modules
│     ├─ auth
│     │  ├─ components
│     │  └─ lib
│     │     └─ auth.types.ts
│     ├─ events
│     │  └─ event-detail
│     │     ├─ components
│     │     │  ├─ purchase-summary.tsx
│     │     │  └─ ticket-selector.tsx
│     │     ├─ event-detail-page.tsx
│     │     └─ services
│     │        └─ event-detail-services.ts
│     ├─ home
│     │  ├─ components
│     │  │  ├─ featured
│     │  │  │  ├─ featured-carousel-dot-button.tsx
│     │  │  │  ├─ featured-carousel-slide.tsx
│     │  │  │  └─ featured-carousel.tsx
│     │  │  └─ thumbnail-carousel
│     │  │     ├─ thumbnail-carousel.tsx
│     │  │     └─ thumbnail-slide.tsx
│     │  └─ home-page.tsx
│     ├─ organizer
│     │  └─ new-organizer
│     │     └─ components
│     │        └─ forms
│     │           └─ register-organizer-form.tsx
│     └─ shared
│        ├─ components
│        │  ├─ footer
│        │  │  └─ footer.tsx
│        │  ├─ header
│        │  │  ├─ header.tsx
│        │  │  └─ navigation-bar.tsx
│        │  └─ ui
│        │     ├─ badge.tsx
│        │     ├─ button.tsx
│        │     ├─ card.tsx
│        │     └─ separator.tsx
│        ├─ lib
│        │  ├─ prisma.ts
│        │  └─ utils.ts
│        └─ services
│           └─ events-services.ts
└─ tsconfig.json

```
