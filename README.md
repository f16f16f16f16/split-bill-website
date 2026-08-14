# Split Bill

Split trip expenses with friends. Create a trip, add the people going, then add a bill for each day or expense. Everyone with the link can check off which items were theirs and mark themselves as paid — no accounts needed.

Live at [nontatech.dev/labs/split-bill](https://www.nontatech.dev/labs/split-bill).

## Features

- **Trips** hold a shared list of participants and any number of bills (e.g. one per day)
- **Bills** have line items with prices; anyone checks off which items were theirs directly on the page
- Each bill records who paid for it, with optional payment info (bank/PromptPay/etc.) so others know how to pay them back
- "Who owes what" breaks each person's total down per bill and per item
- English and Thai, switchable, defaults to English
- Mobile-first responsive layout

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + [Neon](https://neon.tech) (Postgres), via Neon's serverless driver adapter
- Deployed on Vercel, proxied under [nontatech.dev](https://www.nontatech.dev)'s `/labs/split-bill` path
