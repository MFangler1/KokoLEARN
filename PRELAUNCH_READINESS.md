# KokoLEARN pre-launch readiness

Prepared on 4 September 2026 for branch `prelaunch-readiness-2026-09-04`.

This branch must be reviewed and tested in a non-production environment. It must not be merged or deployed until every release gate below has an owner and recorded evidence. Back up the production D1 database before applying any migration.

## P1 changes in this branch

- Stripe price IDs are configuration-only and are verified against mode, currency, amount, billing interval, and active state before checkout.
- Production checkout fails closed when Stripe mode, keys, prices, or the canonical HTTPS site URL are absent or inconsistent.
- Stripe webhooks verify signatures and test/live mode, retrieve the authoritative subscription, persist lifecycle state, distinguish the add-on subscription, and return an error when persistence fails so Stripe can retry.
- Existing paid customers are directed to the Stripe billing portal instead of being allowed to create duplicate plan subscriptions.
- The extended-questions add-on is unavailable unless its price is configured and the customer already has an active paid plan.
- Paid access and question limits are derived on the server. The free trial is limited to 24 hours and three generated lessons.
- Authentication no longer disables CSRF/origin checks, records IP/geolocation, or falls back to ephemeral in-memory accounts when D1 is unavailable.
- Child profiles are stored account-side in D1. The server enforces ages 5–14, validates names/interests, enforces plan child limits, and checks profile ownership before lesson generation.
- AI Tutor prompts cover ages 5–14 and include child-safety, privacy, crisis, purchase, diagnosis, and prompt-injection boundaries. Child names are not sent to the model.
- Sensitive write endpoints now require an authenticated user and/or a trusted same-origin request as appropriate.
- Security response headers include a restrictive content-security policy, clickjacking protection, MIME sniffing protection, a strict referrer policy, and disabled camera/microphone/geolocation permissions.
- Public age, curriculum, privacy, terms, and FAQ wording has been aligned with the implemented product.
- Next.js, React, Better Auth, Stripe, OpenNext, and Wrangler were updated to remove the high-severity dependency findings present at the start of the audit.

## Release gates requiring account-level evidence

### Database and rollback

- Create and verify a restorable production D1 backup.
- Inspect the production schema and D1 migration history. If the existing `0000` and `0001` schemas were applied outside Wrangler migrations, baseline them before applying `0002_wandering_skaar.sql`; do not blindly replay them against production.
- Apply all migrations to a separate staging D1 database first, then test account creation, child creation, trial limits, paid access, cancellation, and referral rewards.
- Confirm Supabase row-level security, service-role handling, backup, retention, and deletion behavior for lesson/progress data.

### Stripe

- In a staging Worker, set `STRIPE_MODE=test`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, and all five `STRIPE_PRICE_*` values.
- Confirm that the configured products and prices are active, recurring, GBP, and exactly match the approved amounts displayed by the application.
- Configure the webhook endpoint for checkout completion and subscription lifecycle events used by the application. Verify signing-secret rotation and failed-delivery alerting.
- Enable and brand the Stripe customer portal; configure allowed plan changes, cancellation timing, invoices, tax, refund policy, and customer emails.
- Test successful payment, authentication-required payment, failure and retry, past-due state, cancellation at period end, immediate cancellation, renewal, duplicate checkout prevention, add-on purchase/cancellation, and webhook replay/out-of-order delivery.
- Repeat the configuration review with live Stripe credentials immediately before launch. Never copy test price IDs into the live environment.

### Authentication, privacy, and child safety

- Set and verify the production Better Auth secret/base URL and trusted origins, including any intentional `www` or staging hostnames.
- Confirm Cloudflare logs, analytics, and any upstream services do not retain child IP/geolocation beyond the documented and approved policy.
- Complete a UK GDPR/DPIA and Age Appropriate Design Code review, including lawful basis, parental responsibility/consent, retention, deletion, subject access, incident response, and international transfers.
- Obtain written processor/data-use terms for the AI provider, including retention and model-training controls. Confirm that prompts and outputs are not used to train third-party models.
- Perform human red-team testing across ages 5–14 for personal-data requests, grooming/secrecy, self-harm, abuse disclosure, sexual/violent content, discrimination, unsafe challenges, purchases, medical/legal advice, and prompt injection.
- Have qualified curriculum reviewers test the KS1, KS2, and starter KS3 objectives and remove any marketing claim that exceeds verified coverage.

### Operations

- Verify transactional email delivery plus SPF, DKIM, and DMARC; test signup, verification, password reset, referral, and support flows.
- Configure monitoring and alerts for authentication failures, D1 failures, Stripe webhook failures, AI-provider failures, and unusual usage/cost spikes without logging child content or identifiers unnecessarily.
- Run a staging smoke test on the built Cloudflare artifact, including CSP/browser-console checks and mobile/accessibility testing.
- Have legal counsel approve the privacy notice, terms, refund/cancellation wording, and child-safety disclosures.

## Known follow-up debt

- The full repository lint run passes with 41 pre-existing unused-code/style warnings and no errors. The warnings should be cleaned up or explicitly accepted before enforcing a zero-warning CI gate.
- The remaining moderate dependency advisories are in the Drizzle Kit development toolchain. Do not use the audit tool's forced downgrade; track a compatible upstream update and keep migration tooling out of the production runtime.
- The KS3 catalogue added here is a safe starter set, not evidence of full National Curriculum coverage.
