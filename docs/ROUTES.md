# Route inventory — platform-front → v4

Snapshot of `platform-front` (September 2026) to decide what the v4 rebuilds. **Buckets are proposals — Thomas
decides.** Lines = page + main components it relies on (excluding `src/lib`).

| Bucket | ~Lines | Contents |
|---|---|---|
| **P1** — funnel, listings, referral, org profile, home | 10,100 | see below |
| **P2** — other core features | 5,550 | events, Compass, notifications, settings, facilitator |
| **POSTPONE** — after the switch | 3,870 | data pilots, docs, admin, discussions, value-chain, feedback |
| **DROP** | 3,170 | /design v3, changelog, test page, dead files, duplicates, redirects |

## P1

| Path | Guard | Notes |
|---|---|---|
| `/` | public (→ `/$orgSlug/dashboard` if the user has an org) | landing + pending actions + activity feed |
| `/login`, `/forgot-password`, `/reset-password` | public | |
| `/register` (hub), `/register-basic`, `/register-with-org`, `/register-invitation` | public | org-wizard (search → claim or create) shared with `/organizations/new` |
| `/verify-instructions`, `/verify-email` | public | |
| `/global` | auth | directory: explore shell (filters, cards/list/map, infinite scroll) |
| `/organizations/new` | auth | create or claim |
| `/organizations/$id` | auth | public org profile: claim, join, add as partner, listings |
| `/marketplace`, `/marketplace/$id` | **public** | listing contact → messages |
| `/marketplace/new`, `/marketplace/$id/edit` | auth | one shared `ListingForm` + images |
| `/messages`, `/$orgSlug/messages` | auth / org member | messaging (as user or as org) |
| `/$orgSlug/dashboard` | org member | logged-in home |
| `/$orgSlug/profile` | org member | profile editor (1,000-line page today, `?section`) |
| `/$orgSlug/relations` | org member | add partner orgs — referral loop |
| `/$orgSlug/settings/members` | org member | invitations + join requests — the primary referral loop |
| `/$orgSlug/listings` | org member | **orphaned today (no link)** — needs a nav entry in v4 |

## P2

| Path | Guard |
|---|---|
| `/events`, `/events/new`, `/events/$eventId`, `/events/$eventId/edit` (shared form in v4) | auth |
| `/$orgSlug/assessments`, `…/$formId`, `…/$formId/results` (Compass) | org member |
| `/notifications`, `/settings`, `/notification-preferences` (→ settings tab?) | auth |
| `/facilitator`, `/facilitator/network`, `/facilitator/network/$norgId` | facilitator |
| `/network-invitation` | public |

## POSTPONE

| Path | Why |
|---|---|
| `/data`, `/data/rotterdam`, `/data/rotterdam/charts`, `/data/athens` | city-data pilots, not linked |
| `/docs` | not linked; could move to the Learning Hub |
| `/admin/*` (organizations, users, feedbacks, claims) | internal, URL only — claims gate the funnel, consider P2 |
| `/discussions`, `/discussions/$postId` | hidden from the sidebar, needs a product decision |
| `/value-chain` | stats page, only a footer link |
| `/feedback` | not linked |

## DROP

| Path / file | Why |
|---|---|
| `/design` + `components/design/` | v3 showcase — the v4 gets its own catalog |
| `/changelog` | hardcoded, stale |
| `/test/google-address` + `GoogleAddressAutocomplete` + `google-maps-loader` | test page, only Google Places user |
| `/organizations/$id/edit` + `OrganizationForm` | duplicate of `/$orgSlug/profile` |
| `/register-facilitator` | a mailto card — fold into the register hub |
| `routes/org/settings-informations.tsx`, `components/TabBar.tsx` | dead files |
| `/organizations`, `/map`, `/directory`, `/$orgSlug`, `/$orgSlug/settings` | redirects — keep `/communities*` → `/global` as one-liners for old email links |

## Shared building blocks to rebuild

- **Explore framework** — `explore/ExploreShell`, `ExploreFilters`, `InfiniteScrollSentinel`, `lib/explore.ts` (location defaults to "Me", 100 km)
- **Maps** — MapLibre `PointsMap` (generic) ; hexbin maps only for data pilots
- **Address autocomplete** — Photon (`PhotonAddressAutocomplete`, `lib/geocoding.ts`)
- **Uploads** — presigned `/uploads/presigned_url` + direct PUT ; listing images, org photos, avatar
- **Messaging** — `MessagingLayout`, `MessageBell`, `lib/conversations.ts`
- **Notifications** — `NotificationBell`, `lib/notifications.ts` (`getNotificationUrl`)
- **Taxonomies** — listing types/categories, `ORG_KINDS`, specialties, NACE codes, facility types, countries
- **Org wizard** — search → claim or create (register + `/organizations/new`)
- **Referral** — invitations, join requests, relations, pending actions
- **Activity feed**, **dynamic forms** (`lib/forms.ts` conditional questions + `lib/answers.ts`), **charts** (recharts), **network graph** (react-force-graph-2d)

## Fix while rebuilding

- Several `src/lib/*.ts` call raw `fetch` (for pagination headers) instead of the client → one client in v4.
- Cross-links: `/$orgSlug/listings` unreachable ; org show "Back to list" goes through a redirect ;
  facilitator org detail links to the duplicate edit page.
