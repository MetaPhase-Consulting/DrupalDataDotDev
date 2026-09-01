# ChallengeSQL

The data layer: correctness, performance, and who can reach what.

## Covers

Schema design, query correctness and performance, migrations, and database-level
access control.

## The requirement

SP 800-53 Rev. 5 Access Control (AC), Audit and Accountability (AU), and System
and Communications Protection (SC-28, protection at rest). Where the data
concerns individuals, the Privacy Act and the PIA govern what may be stored and
for how long.

## Access

- **Reached through a server-side layer.** The browser holds no database
  credential and issues no query.
- **Least privilege by role.** The application connects as a role holding narrow
  per-table grants rather than as the owner, and something asserts those grants
  so a migration that widens access fails rather than passing silently.

  Build this early. A role added after the schema has grown means auditing every
  table to work out what the application actually needs.
- **Row-level security enabled and forced** on tables that carry it, so the
  owner cannot bypass the policy by accident.

## Migrations

Migrations are checksummed, and the runner records a hash of each file.

**An applied migration is never edited, comments included.** Changing one makes
the runner report a mismatch on every subsequent run, and the fix for a bad
migration is another migration.

## Performance

Queries that touch a growing table are checked against a plan rather than
against intuition. An index helps only when the planner chooses it, and a join,
a function on a column, or a mismatched type will each quietly defeat one.

## In this repository

There is no database of any kind, and no server to hold one against — this
is a fully static, client-only SPA (see ChallengeIaC). Confirmed by a
repository-wide search: no database client, ORM, or connection string
anywhere in the code.

The only "data" this system handles:

- **User-supplied CSV/JSON**, uploaded or pasted directly in the browser,
  parsed client-side (`papaparse`), held only in React component state
  (`Generator.tsx`), and never sent anywhere — the app has no server to send
  it to. It disappears when the tab closes or the page reloads.
- **Static configuration files committed to the repo**
  (`src/data/chartStyles.json`, `chartTypes.json`, `libraries.json`,
  `sampleData/`, `visualizationTypes/`) — read-only, shipped with the
  build, carrying no user or personal data.

Every requirement in this tool file's "Access," "Migrations," and
"Performance" sections is inapplicable for the same reason: there's no
database role to scope, no migration history to checksum, no query plan to
check. This is a genuine, structural non-applicability, not an unfilled gap.

## Evidence

- The migration history is the schema history.
- The grants held by the application role, and whatever asserts them, are the
  access-control evidence.
- Database tests run against a real migrated database rather than a mock.

None of this applies. If persistence is ever added to this system, this
tool file's requirements become live and need rewriting from an actual
schema — not before.

## Review checklist

- Does this migration edit one that has already been applied?
- Does a new table need row-level security, and is it forced as well as enabled?
- Does the application role get the narrowest grant that works?
- Does a new query have a plan that uses the index it was written for?
- Does a new column hold personal information the PIA does not mention?
- **This repository-specific:** if a future version of this tool adds
  server-side persistence (saved visualizations, user accounts, anything),
  does `profile.yml`'s `privacy_assessment_required: false` get revisited
  in the same change, rather than left stale? Today it's accurate because
  nothing is stored anywhere.
