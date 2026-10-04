# IDOLPAD

Independent BNB Chain application for creating original AI idols, preparing short-form media, and launching an idol token through Flap.

The implementation reproduces a public product category and workflow. It does not copy Higgspad source code, trademarks, private prompts, characters, or proprietary media.

## Current state

- Complete responsive landing page.
- Three-step idol creation and launch wizard.
- Original concept gallery, owner dashboard, Studio and docs.
- EIP-1193 wallet connection with BNB Chain switching.
- Server-only media provider boundary that fails closed while unconfigured.
- Direct Flap Tax Token V3 parameter validation and preflight boundary.
- Typed APIs for drafts, characters, templates, videos, uploads, settings and launch preflight.
- Local JSON repository adapter for development records.

No mainnet transaction is broadcast by this version. Media generation and token launch remain disabled until their production adapters and security gates are configured.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Quality gates:

```bash
npm test
npm run lint
npm run build
```

## Production configuration

Copy `.env.example` to a private `.env.local` and provide server-side values. Never commit credentials.

The launch write must not be enabled until it performs all of these steps against current BNB state:

1. verify chain ID 56;
2. verify the canonical Flap Portal proxy and current approved implementation;
3. verify native BNB quote admission;
4. upload image and metadata and obtain raw CIDs;
5. mine a random, unoccupied Tax V3 address ending in `7777`;
6. simulate the exact `newTokenV6` call and estimate gas from the signer;
7. display the complete tuple and economics;
8. authenticate the canonical `TokenCreated` receipt and deployed bytecode.

Media providers must return real asynchronous jobs. The UI must never substitute mock success in production.

## Verified reference snapshot

The Flap integration constants and constraints were researched read-only on October 4, 2026. Because proxies and protocol admission can change, production must re-read mutable state immediately before every wallet write.