# IDOLPAD product specification

Date: 2026-10-04

## Product

IDOLPAD is an independent BNB Chain product inspired by the public product mechanics of Higgspad. It must not copy Higgspad trademarks, source code, generated characters, proprietary media, private prompts, or private API implementation.

Core promise: Create an AI idol, generate a consistent headshot and full-body identity, create short vertical videos, and launch the idol's token through Flap on BNB Chain.

All product UI and copy are English.

## Product surfaces

1. `/` landing page
   - black editorial layout, condensed uppercase display typography, BNB yellow accent;
   - hero: "LAUNCH AN AI IDOL. WITH ITS OWN TOKEN.";
   - calls to action for Launch and Explore;
   - sections for workflow, motion templates, original idol cards, live tokens, fee model, safeguards, and final CTA;
   - original IDOLPAD visuals only.

2. `/launch` three-step wizard
   - Step 1 Describe: concept, optional appearance, original look presets, upload reference, fine-tune traits, wallet-aware generation CTA, headshot and full-body preview;
   - Step 2 Name: suggested names, editable name/ticker, profile settings;
   - Step 3 Launch: token and identity review, BNB first buy, Flap tax settings, risk acceptance, predicted address/preflight, wallet transaction;
   - preserve draft locally;
   - never claim generation or launch success without verified provider/on-chain evidence.

3. `/explore`
   - original sample cards only until real indexed launches exist;
   - clearly mark non-on-chain seed examples as concept previews;
   - filters and responsive card/table layouts.

4. `/my-idols`
   - connect-wallet state;
   - show only records owned by the connected wallet from the backend.

5. `/studio`
   - connect-wallet state;
   - select owned idol;
   - describe motion, choose a template, or upload an owned/consented video;
   - 5/10 second described clips; template/upload up to 15 seconds; 480p/720p;
   - submit/poll/result/download workflow;
   - fail closed when no media provider is configured.

6. `/docs`
   - concise documentation for wallet auth, AI jobs, video jobs, Flap launches, safeguards, and environment setup.

## Backend API

Implement typed Next route handlers:

- `GET /api/settings/public`
- `POST /api/ai/draft`
- `GET /api/ai/character/credits?wallet=`
- `POST /api/ai/character`
- `GET /api/ai/character/[jobId]`
- `POST /api/ai/character/[jobId]/headshot`
- `POST /api/ai/character/[jobId]/full-body`
- `GET /api/templates`
- `POST /api/uploads/video`
- `GET|POST /api/idols/[id]/video`
- `GET /api/idols/[id]/video/[jobId]`
- `GET /api/idols`
- `POST /api/idols`
- `POST /api/launch/preflight`

For local development, data may use a server-only JSON file adapter. The adapter must be concurrency-safe enough for single-process development and must never be represented as production-grade. Production storage must be replaceable through an interface.

## AI provider boundary

- Create a `MediaProvider` interface for character and video jobs.
- Production calls are server-only.
- No key or provider secret enters browser bundles or API responses.
- If provider variables are absent, APIs return a structured `PROVIDER_NOT_CONFIGURED` response and consume no payment/credit.
- Do not fabricate completed media. A development-only provider may exist only behind explicit `IDOLPAD_DEMO_MEDIA=true`, and every result must visibly say `DEMO`.
- Character prompt builder should combine concept, optional appearance, selected structured traits, identity-consistency instructions, headshot framing, and full-body framing. It should not claim to reproduce Higgspad's private prompts.

## Wallet identity

- Use injected EIP-1193 wallets.
- Require BNB Chain mainnet, chain ID 56.
- Wallet connection is not authentication by itself. Backend writes must be designed to require nonce/message signatures before production. The local prototype may keep write endpoints disabled unless `IDOLPAD_ALLOW_LOCAL_WRITES=true`.
- Never request, store, or expose private keys.

## Flap launch adapter

Canonical values verified read-only on 2026-10-04:

- chain ID: 56
- Portal proxy: `0xe2cE6ab80874Fa9Fa2aAE65D277Dd6B8e65C9De0`
- Tax Token V3 implementation: `0x024f18294970B5c76c0691b87f138A0317156422`
- method: `Portal.newTokenV6`
- tokenVersion: `TOKEN_TAXED_V3 = 6`
- dexThresh: `FOUR_FIFTHS = 1`
- migratorType: `V2_MIGRATOR = 1`
- quote token: native BNB / zero address
- dexId: `DEX0 = 0`
- lpFeeProfile: standard = 0
- allocations must total 10,000 bps
- buy/sell tax each 0..1,000 bps and at least one non-zero
- `taxDuration >= antiFarmerDuration + 1 day`
- direct token address must end in `7777`

The browser launch path must remain disabled unless:

- chain is 56;
- canonical addresses and RPC are configured;
- Portal version/implementation and native quote admission pass fresh read-only checks;
- metadata upload returns a raw CID;
- a random vanity salt predicts an unoccupied `7777` address;
- exact `eth_call` and `eth_estimateGas` succeed from the connected signer;
- user sees final tuple economics and accepts risk.

The receipt is successful only when canonical Portal `TokenCreated` matches creator, predicted token, name, symbol, and metadata CID and token bytecode is non-empty.

No custom Vault is required for v1. Use `beneficiary` for the market allocation. A custom Vault is a separate later product if automatic multi-party on-chain splitting is required.

## Fee policy for initial implementation

Expose a conservative configurable Tax V3 setup:

- buy tax: 1%
- sell tax: 1%
- allocation: 70% idol treasury beneficiary, 30% deflation/burn;
- dividends: 0%;
- LP allocation: 0%;
- tax duration: 365 days;
- anti-farmer duration: 1 hour;
- no hidden launch success, fees, or guarantees.

These defaults are product configuration, not a claim that Flap itself enforces an IDOLPAD platform-token buyback.

## Security and truthfulness

- Zod-validate every API payload and reject unknown fields.
- Rate-limit expensive endpoints through an interface and documented production requirement.
- File uploads: MIME/size checks, explicit rights acceptance, server-issued upload target abstraction.
- No real-person likeness preset and no impersonation marketing.
- Every generated profile/content surface must display `AI-generated`.
- Tokens are speculative and do not grant ownership of the idol, generated media, or platform.
- No production write should proceed when dependencies are missing or mutable preflight changed.

## Testing and release gates

Use strict RED-GREEN-REFACTOR for new behavior.

Tests must cover:

- ticker normalization and validation;
- fee allocation and tax-duration invariants;
- BNB chain/wallet state labels;
- fail-closed provider state;
- launch tuple construction;
- canonical TokenCreated receipt matching;
- settings API does not expose secrets;
- generation form and launch wizard transitions;
- mobile layout at 390px without horizontal overflow.

Final gates:

- unit/component tests pass;
- ESLint passes;
- production build passes;
- local HTTP routes render;
- desktop and mobile browser QA;
- clean browser console;
- no secrets committed;
- no deployment or mainnet transaction without explicit user authorization.
