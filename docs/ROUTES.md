# Route inventory — platform-front → v4

Snapshot of `platform-front` (September 2026) to decide what the v4 rebuilds. **Buckets are proposals — Thomas
decides.** Lines = page + main components it relies on (excluding `src/lib`).

| Bucket | ~Lines | Contents |
|---|---|---|
| **P1** — funnel, listings, referral, org profile, home | 10,100 | see below |
| **P2** — other core features | 5,550 | events, Compass, notifications, settings, facilitator |
| **POSTPONE** — after the switch | 3,870 | data pilots, docs, admin, discussions, value-chain, feedback |
| **DROP** | 3,170 | /design v3, changelog, test page, dead files, duplicates, redirects |

## Rebuilt in v4

| Path | Notes |
|---|---|
| `/` | public landing (the design system's Landing screen: hero + "Browse the marketplace", three audiences — organisations and viewers → `/register`, facilitators → an email to the FABRIX team — pilot notice, about, footer with the EU acknowledgement in full). Signed in → the org dashboard, or `/home` without an org. Pending actions and the activity feed of the old `/` go to the dashboard. An expired session on a public page (landing, marketplace, public profile) just means "visitor"; on a signed-in page it goes to `/login` (`lib/session.ts`) |
| `/home` | signed in without an organisation: "Add your organisation" |
| `/$orgSlug/assessments`, `…/$formKey` | Compass. The list asks `GET /forms?organization_id=`, which already carries this organisation's answers: status (not started / in progress / completed), score ring, and how many are done. The questionnaire renders the six field types (text, email, select, multiselect, rating, table), hides questions whose `condition` is not met, and saves on its own — `POST /answers` the first time, then `PATCH` (the API deep-merges). Status and score are the server's to decide |
| `/global` | Directory: every organisation, filtered by search, what they do (the 12 kinds), where (near my organisation + radius, country) and status (on FABRIX / claimable). Cards, list or map — the map colours claimable ones amber, and its payload (`view=map`) has no `claimed`, so the list's knowledge is passed to it. Each row opens the public profile |
| `/events`, `/events/$eventId` | auth. List: search, upcoming / past, near my org + radius, country; cards / list / map. Detail: when and where (or the link, for an online one), description, RSVP (going / maybe / can't go — answering again changes it, clicking the same answer takes it back), who is going, and edit / delete for its creator. Adding and editing happen in a dialog, on the shared `EventForm` (the online switch swaps the address for a URL) |
| `/$orgSlug/relations` | Connections: the partners you work with, from the profile payload (`relations` + `related_organizations`). Add one (search → relation type → optional note, `POST /relations`), remove one, see which are not claimed yet. An organisation not on FABRIX is added through `/organizations/new`, which invites it |
| `/$orgSlug/settings/members` | **gone** — redirects to `/$orgSlug/profile?tab=team`. The team, its invitations and the join requests live in the profile's Team tab (the PM's prototype) |
| `/$orgSlug/dashboard` | signed-in home, from the design system's Home screen: greeting, pending actions (join requests on orgs you own → the profile's Team tab, invitations received, your claims and join requests), "The loop" (add a partner → `/organizations/new`), your network (connections + profile essentials → editor), "Around you" (`/feed?organization_id=`, show more). Not rebuilt: the design's network-wide "partners invited this month" counter and "Yours: X invited, Y joined" — no API for them |
| `/messages`, `/$orgSlug/messages` | messaging — one page for both mailboxes: with an organisation slug it keeps the conversations that organisation is a side of and answers in its name, without one it shows everything you are part of and answers as you (`GET /conversations` returns both; there is no per-organisation endpoint). Mailbox on the left (who, last message, unread count), thread on the right, the open one in `?conversation=`; on a phone one replaces the other. Enter sends, Shift+Enter breaks the line. Opening a thread marks it read (`PATCH /conversations/:id/read`) and refreshes the sidebar counter. Conversations are *started* from a profile or a listing (`ContactOrganizationDialog`), never from here |
| `/notifications` | the server writes each message (`NotificationMessageBuilder`), so the page renders it as is rather than composing text per type. All / Unread in `?filter=` — the index takes no unread filter, so Unread narrows what is already loaded. Opening one marks it read, "Mark all as read" clears the lot, both refresh the sidebar counter. Paging is by feel: `GET /notifications` is paginated by Pagy but answers `{ notifications }` with **no meta**, so a full page is the only sign another may follow. Community and challenge types are legacy — those rows render without a link; the rest lead to the profile's Team tab, an organisation, or an event |
| `/settings` | Account and Notifications in `?tab=`. **Account**: photo (direct-to-S3 on the `User` record), name, email and password as four separate blocks, because the API's rules differ — `PATCH /me` demands `current_password` to change an email or a password, and a new email reverts the account to unverified and sends a fresh verification mail. Then deleting the account (`DELETE /me`) behind a dialog, which signs you out and clears the cache. **Notifications**: `GET /notification_preferences` lists every type — retired ones are hidden rather than shown under a raw key — with On / In app / Email; the three action-required types come back `mandatory` and their switches are disabled, since the API refuses to change them (422). The two channels are disabled while a notification is off |
| `/facilitator`, `/facilitator/$networkSlug` | **one dashboard per network**, and the sidebar lists them all — `me.networks` already carries them, so there is nothing to fetch and nothing to switch between once you are inside one (this replaces the old front's `?network=` + localStorage selection, and its "My network" page). `/facilitator` opens the first, or explains how to get one. The features are tabs, like the profile (`TabLink`, `?tab=`): **Overview** (organisations followed, open tasks, overdue, what is next, the territory), **Organisations** (the CRM records, searched through `?q=`, infinite), **Tasks** (add, tick, delete; to do / done in `?tasks=`), **Team** (who has access, colleagues to grant it to, pending invitations, invite by email). The API refuses to remove the network's creator (403) and the last member (422), so neither is offered — the creator's row reads "Creator" instead. Not rebuilt: the map and the network graph. **The space is tinted apart** from the rest of the platform — it is a work surface, not the organisation-and-people side: the layout route stamps `data-space="facilitator"` on `<html>` and `index.css` swaps four variables under it (`fx-panel`, `fx-emphasis`, `fx-emphasis-soft`, `fx-line`) to indigo on a cooler grey. No component changes, because components read token *names*. It sits on `<html>` and not on a wrapper so that dialogs — which Radix portals to `<body>` — are tinted too; the route removes the attribute on the way out |
| `/facilitator/$networkSlug/organizations/$recordId` | **the CRM sheet — not the public profile**, which is what a facilitator opens from the Organisations tab. It holds what this network knows and the public profile never shows: the health the facilitator sets (economic and environmental, edited in place), their notes (saved on their own, one PATCH per pause), the needs they assessed with a note each (`needs` jsonb — the keys match production data, do not rename them), the figures this network keeps (turnover, employees, growth), the organisation's people with their emails, the logged interactions (call / email / meeting / visit), and the organisation's **own** needs form read-only — that one is the organisation's answer, reusing the Compass queries and its `isVisible` (extracted to `features/compass/visibility.ts` so both share it). The public profile is one click away in the header. Unfollowing deletes the whole record, so it asks first |
| `/login`, `/verify-*`, `/forgot-password`, `/reset-password` | |
| `/register` | one wizard: find your organisation → claim it / create it (details, address on the map, specialties) / "I'm not part of one" → account. Replaces the old hub, `/register-basic` and `/register-with-org` |
| `/organizations/new` | search → claim an unclaimed one, or create: **mine** (`owner_email: ""`, I own it) or **a partner** (`owner_email` = their email → they are invited to claim it) |
| `/design` | the v4 catalog |
| shell (sidebar, org switcher, user menu, unread counts) | every other entry lands on a temporary `PagePlaceholder` |
| `/marketplace`, `/marketplace/$id` | open to visitors; filters: search, type → category → speciality, near my org + radius, country; cards / list / **map** (MapLibre + Carto Positron, keyless: clustered pins coloured by listing type, the radius filter drawn as a circle, a card on click; `?view=map` fetches them all through `GET /listings?view=map`) |
| `/marketplace/new`, `/marketplace/$id/edit` | photos upload after create / immediately on edit |
| `/$orgSlug/listings` | **gone** — redirects to `/$orgSlug/profile?tab=edit&section=offers-needs`. Offers are listed there, and created or edited in a dialog (`NewListingDialog` / `EditListingDialog` wrap the same `ListingForm` as `/marketplace/new` and `/marketplace/$id/edit`, which the marketplace keeps) |
| `/organizations/$id` | public profile (slug or UUID), open to visitors: header, about, listings, photos, connections, contact / specialties / networks. Actions by viewer: member → edit + add a listing; visitor → sign in; other member → connect (relation), message (claimed), request to join (claimed) or claim (unclaimed). Private data (workers, turnover, NACE…) is **not displayed** — but the API still returns it publicly |

**Marketplace — left for later:** map view and "near a city" search (with events/directory, same explore
frame); closed or expired listings of your own org are not listed (the API index returns available ones only);
"Posted by" does not link to the org yet (public profile not rebuilt).

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
