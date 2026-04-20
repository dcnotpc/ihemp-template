# iHemp Content Schema
Version: 1.0
Effective: Phase 1.5 (2026-04-20)
Branch: phase-1.5-content-foundation

---

## Purpose

This document is the single source of truth for all content frontmatter in the iHemp network. It defines the required fields, optional fields, status lifecycle, tagging rules, filename conventions, and folder structure for every piece of content stored in this repository. The schema is enforced by the frontmatter validator (introduced in Phase 1.5 Chunk B6) at submission time — no content enters the pipeline without passing validation. The same schema is consumed by `src/lib/blog.ts` (reader), and will be consumed by the approval UI in Phase 2. Any change to this schema requires CEO approval and a corresponding validator update.

---

## Required Fields (always present)

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Human-readable post title |
| `slug` | `string` | Kebab-case identifier — must match the filename (e.g., `my-post` for `my-post.mdx`) |
| `date` | `string` | ISO 8601 date string — publication or creation date (e.g., `2026-04-20`) |
| `status` | `enum` | Content lifecycle state — see Status Lifecycle below |
| `type` | `enum` | Content type — `blog` \| `law-update` \| `advocacy` (expandable with approval) |
| `states` | `string[]` | Array of state slugs this content targets, or `["all"]` for network-wide content |
| `excerpt` | `string` | 1–2 sentence summary — used in blog list views and as fallback SEO description |
| `tags` | `string[]` | Array of tags — must exist in `content/TAGS.yml` — see Tagging Rules below |
| `agent` | `string` | Agent ID that authored this content (e.g., `content`, `research`); use `human` for manual authorship; use `legacy` for pre-Phase-1.5 posts |
| `created` | `string` | ISO 8601 datetime — when the file was first created (e.g., `2026-04-20T09:00:00-04:00`) |
| `updated` | `string` | ISO 8601 datetime — when the file was last modified |

---

## Required When `status: published`

These fields are optional for drafts and review, but **required before a post may be marked `published`**. The validator enforces this at the `approved → published` transition.

| Field | Type | Description |
|-------|------|-------------|
| `seo_title` | `string` | Page `<title>` tag — ≤60 characters recommended |
| `seo_description` | `string` | Meta description — ≤160 characters recommended |
| `affiliate_disclosure` | `boolean` | `true` if post contains any affiliate links — triggers disclosure banner |
| `health_claims_reviewed` | `boolean` | `true` confirms a human has verified the post contains no unreviewed health claims |

---

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `author` | `string` | Human author byline (displayed on post if present) |
| `reviewed_by` | `string` | Reviewer name or handle — approval audit trail |

---

## Status Lifecycle

```
draft → review → approved → published → archived
```

| Status | Meaning | Who sets it |
|--------|---------|-------------|
| `draft` | Agent output — not yet reviewed | Agent |
| `review` | Submitted for Compliance + QA review | Agent or CEO |
| `approved` | CEO approved — ready to deploy | CEO |
| `published` | Live on site (committed + deployed) | CEO or future Publishing Agent |
| `archived` | Removed from display; preserved in Git history | CEO |

**Only `published` content is visible on the live site.** The blog reader (`getAllPosts`, `getPostBySlug`) filters to `status: published` (enforced in Phase 1.5 Chunk B/C reader updates).

Agents write to `draft`. Humans advance through the lifecycle via the approval UI (Phase 2). No agent may set `status: approved` or `status: published` autonomously.

---

## Tagging Rules

1. **2–6 tags** per post
2. **At least 1 tag** from `legal_regulatory` or `advocacy`
3. **Exactly 1 tag** from `educational` (`beginner` / `intermediate` / `deep-dive` / `myths` / `history`)
4. **At least 1 tag** from `product_types` on content about growing, processing, or physical goods — pure policy/advocacy posts are exempt
5. **All tags must exist** in `content/TAGS.yml` — unknown tags fail validation
6. New tags require CEO sign-off and a TAGS.yml update before use

---

## States Field

- Always an **array** — even for single-state content
- Single-state: `states: ["colorado"]`
- Network-wide: `states: ["all"]`
- Field name is `states` (plural)
- The legacy `state` (singular string) field is **deprecated and removed in Phase 1.5** — Chunk C migrates all existing posts

---

## File Extension

- `.mdx` **only** going forward
- Chunk C will migrate the 4 existing `.md` posts to `.mdx`
- The reader (`blog.ts`) supports both during the transition window; after Chunk C, `.md` support may be removed

---

## Filename Convention

```
{slug}.mdx
```

- **No date prefix** — date lives in frontmatter only
- This keeps Git history stable if a publication date changes
- Slug must be kebab-case and must match the `slug` frontmatter field exactly

---

## Folder Structure

```
content/
  blog/          # Published blog content — deployed to live sites
  law-updates/   # Published law/regulatory updates (future)
  advocacy/      # Published advocacy content (future)
  drafts/        # Agent staging area — NOT deployed
  TAGS.yml       # Controlled tag vocabulary — source of truth
```

**`content/drafts/`** is committed to Git for history and audit trail, but excluded from the blog reader by path filtering. Nothing in `drafts/` is ever visible on the live site until it is moved to the appropriate content folder with `status: published`.

---

## MDX Components

Only components exported from `src/lib/mdx-components.tsx` may be referenced in post bodies. New components require human approval before addition to the whitelist. The validator will flag any component reference not present in the whitelist at submission time.

---

## Example — Minimal Valid Draft

```mdx
---
title: "Michigan Hemp Farmers Face New Licensing Rules"
slug: "michigan-hemp-farmers-licensing-2026"
date: "2026-04-20"
status: draft
type: blog
states: ["michigan"]
excerpt: "A new licensing requirement takes effect in Michigan this fall, affecting hundreds of registered hemp farmers across the state."
tags:
  - state-law
  - licensing
  - beginner
agent: content
created: "2026-04-20T09:00:00-04:00"
updated: "2026-04-20T09:00:00-04:00"
---

Body content here.
```

## Example — Minimal Valid Published Post

```mdx
---
title: "Michigan Hemp Farmers Face New Licensing Rules"
slug: "michigan-hemp-farmers-licensing-2026"
date: "2026-04-20"
status: published
type: blog
states: ["michigan"]
excerpt: "A new licensing requirement takes effect in Michigan this fall, affecting hundreds of registered hemp farmers across the state."
tags:
  - state-law
  - licensing
  - beginner
agent: content
created: "2026-04-20T09:00:00-04:00"
updated: "2026-04-20T09:15:00-04:00"
seo_title: "Michigan Hemp Licensing 2026 — What Farmers Need to Know"
seo_description: "New Michigan hemp licensing rules take effect this fall. Here's what registered growers need to do before the deadline."
affiliate_disclosure: false
health_claims_reviewed: true
author: "Content Agent"
reviewed_by: "David Crabill"
---

Body content here.
```

---

## Change Log

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-04-20 | OpenClaw | Initial schema — Phase 1.5 Chunk B5 |
