# Neon Brick Grid (Base)

Mobile-first swipe puzzle (`web/`) plus Foundry `CheckIn` contract (`contracts/`).

## Web app

```bash
cd web
cp .env.example .env.local
# Set NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS after deploy; BASE_APP_ID and BUILDER_CODE from base.dev
npm install
npm run dev
```

Production: **https://lego-games.vercel.app** — Vercel **Root Directory** = `web`. Set all `NEXT_PUBLIC_*` variables (including `NEXT_PUBLIC_BASE_APP_ID` from [dashboard.base.org](https://dashboard.base.org)).

## Contract

```bash
cd contracts
forge test
# Deploy CheckIn.sol to Base mainnet, then paste address into NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS
```

## Assets

- `web/public/icon.jpg` — 1:1, ≤1024px, ≤1MB  
- `web/public/thumbnail.jpg` — ~1.91:1, ≤1MB  

Regenerate if you replace branding.
