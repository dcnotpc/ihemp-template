# BOUNDARIES.md — iHemp AI Operations System
# Hard Rules & Approval Gates

Version: 1.0
Created: 2026-05-02
Owner: David Alan Crabill, CEO
Authority: This file governs all agents and sessions. When BOUNDARIES.md conflicts
with SOUL.md, AGENTS.md, or any other file on the rules listed here, BOUNDARIES.md wins.

---

## Source-of-Truth Priority

When instructions conflict, follow this order:

1. Current user instruction (active session)
2. `ihemp-ops/docs/BIBLE.md`
3. `ARCHITECTURE.md` / `CONTRACTS.md` / `CONTENT_SCHEMA.md`
4. `BOUNDARIES.md` (this file)
5. `ihemp-ops/docs/CURRENT_STATE.md` / `ihemp-ops/docs/DECISIONS.md`
6. `AGENTS.md`
7. `DESIGN.md` / `STRATEGY.md` / `SITES.md`
8. `ihemp-ops/docs/GLOSSARY.md`
9. Daily memory files (`memory/YYYY-MM-DD.md`) — historical evidence only, not authority

---

## Required Preflight (before meaningful implementation work)

Before any non-trivial implementation, verify:

1. Identify the active repo (`git rev-parse --show-toplevel`)
2. Identify the active branch (`git branch --show-current`)
3. Read `ihemp-ops/docs/BIBLE.md`
4. Read `ihemp-ops/docs/CURRENT_STATE.md`
5. Read `ihemp-ops/docs/DECISIONS.md`
6. Read relevant architecture, contract, schema, design, or site docs for the task
7. Identify approval gates that apply
8. State intended files to modify before non-trivial changes

Skip steps only for clearly trivial work (typo fixes, read-only queries, discussion).

---

## Approval Gates — CEO approval required before:

### Code & Data
- Committing to `main` or any production branch
- Pushing to remote (`git push`)
- Running any DB migration against production
- Schema changes (`ALTER TABLE`, `CREATE TABLE`, new enums)
- Deleting DB rows or Blob storage files (beyond approved retention scripts)
- Deploying to Vercel (push triggers auto-deploy — confirm before push)

### Content & Publishing
- Publishing any content to a live site
- Moving content from `content/drafts/` to `content/blog/`
- Setting `status: published` or `published_at` on any content record
- Setting `status: approved` on any content or media asset
- Queuing content for distribution to external platforms

### Auth & Config
- Any change to Cloudflare Access policy, JWT config, or auth middleware
- Any change to environment variables in Vercel production
- Any change to DNS records
- Any change to cron schedules
- Adding or removing API keys or secrets

### Destructive Operations
- Deleting or archiving any file, repo, or Vercel project
- Running any script with `--execute` or `--apply` flags for the first time
- Any operation described as "destructive," "irreversible," or "production"

---

## Hard Stop Rules

### No looping
- Maximum 2 consecutive failed attempts at any discrete operation before stopping and reporting to CEO.
- A loop without observable state change (no DB write, no file change, no non-error result) is a bug. Stop immediately.
- Never retry a failed push, migration, or deploy automatically.

### No guessing when a document exists
- If a relevant project document may exist, read it before proceeding.
- Do not infer schema, design tokens, or architecture from memory when the authoritative source is on disk.

### No publishing without explicit approval
- Approved means CEO said "approved," "publish," "go," or equivalent in the active session.
- A prior session's approval does not carry forward to a new session.
- Compliance + QA stamps are required conditions, not sufficient conditions. CEO approval is always required for publish.

### No silent changes
- Any file change must be reported before commit.
- Any DB mutation must be reported before execution.
- "I'll write it up later" is not acceptable. SESSION_LOG and CURRENT_STATE.md update in the same session.

### No scope creep
- Implement only what was explicitly requested.
- Do not add "while I'm in here" changes to unrelated files.
- Do not refactor, rename, or restructure code not directly related to the task.

---

## Michigan Routing Rule (absolute)

- `iHempMI.com` = IN SCOPE (for-profit, Stack A, Vercel)
- `iHempMichigan.com` = OUT OF SCOPE (501(c)(6) non-profit, externally managed)

No agent may publish to, log into, monetize, or route commercial affiliate traffic
to `iHempMichigan.com`. Cross-linking for advocacy/policy is permitted editorially.

---

## Content Safety Rules (absolute)

- NEVER make health claims about CBD or hemp products
- NEVER use: cure, treat, prevent, diagnose, heal, remedy, miracle
- NEVER fabricate research, statistics, citations, or sources
- NEVER auto-publish content without passing Compliance + QA + CEO approval
- NEVER write directly to `content/blog/` — all agent output goes to `content/drafts/` first
- NEVER set `status: approved` or `status: published` — CEO-only actions
- NEVER represent iHemp as anything other than what it is

---

## Memory Writeback Rules

At the end of any meaningful session where project state changed, update:

- `ihemp-ops/docs/CURRENT_STATE.md` — if phase, goal, branch, milestone, blocker, risk, or next action changed
- `ihemp-ops/docs/DECISIONS.md` — if a durable decision was made
- `ihemp-ops/docs/BACKLOG.md` — if new work was discovered or an item resolved
- `ihemp-ops/docs/SESSION_LOG.md` — if implementation work occurred
- `memory/YYYY-MM-DD.md` — structured session summary

Project state changes that trigger CURRENT_STATE.md update:
- Current phase changed
- Active goal changed
- Branch changed
- Milestone completed
- New blocker discovered
- Risk changed
- Next action changed
- Required reference docs changed
- A feature moved from planned → in-progress → complete

Small wording changes, typo fixes, or exploratory discussion with no project-state impact
do not require CURRENT_STATE.md update.

---

*This file is maintained by the iHemp AI Operations System under CEO direction.*
*Changes require CEO approval. Commit prefix: `BOUNDS:`.*
