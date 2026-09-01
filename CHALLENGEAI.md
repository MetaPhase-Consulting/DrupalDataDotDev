# ChallengeAI

ChallengeAI is MetaPhase's accelerator suite for federal software delivery. It
wraps Claude and Codex with the standards a federal system is held to, so the
work arrives already shaped by them rather than corrected into them afterwards.

This repository was built with ChallengeAI, and the standards behind it live in
[`.challengeai/`](.challengeai/). That folder is self-contained: everything an
agent or an engineer needs is written there, and nothing has to be installed
for it to be read.

DrupalDataDotDev is not itself a federal information system — it's a free,
public tool for the Drupal developer community, with no ATO in flight and
none pursued (see [`challenge-ato.md`](.challengeai/challenge-ato.md)).
Several tool files below say so directly rather than inventing federal
posture this repository doesn't actually hold.

## The suite

Twelve tools, each covering one part of delivery.

| Tool | Covers | File |
|---|---|---|
| ChallengeCLI | The accelerator itself, across Claude and Codex | [`challenge-cli.md`](.challengeai/challenge-cli.md) |
| ChallengeAC | Agile artifacts, acceptance criteria, traceability | [`challenge-ac.md`](.challengeai/challenge-ac.md) |
| ChallengeEA | Enterprise architecture and governance | [`challenge-ea.md`](.challengeai/challenge-ea.md) |
| ChallengeATO | RMF, NIST SP 800-53, the security package | [`challenge-ato.md`](.challengeai/challenge-ato.md) |
| ChallengeUI | Section 508, WCAG 2.0/2.1 AA, USWDS | [`challenge-ui.md`](.challengeai/challenge-ui.md) |
| ChallengeAPI | API contracts, validation, interoperability | [`challenge-api.md`](.challengeai/challenge-api.md) |
| ChallengeSQL | Schema and query correctness, performance, security | [`challenge-sql.md`](.challengeai/challenge-sql.md) |
| ChallengeTDD | Test traceability, coverage, release readiness | [`challenge-tdd.md`](.challengeai/challenge-tdd.md) |
| ChallengeCI | Pipeline hardening, evidence gates, scanning | [`challenge-ci.md`](.challengeai/challenge-ci.md) |
| ChallengeCD | Rollout safety, rollback, secrets handling | [`challenge-cd.md`](.challengeai/challenge-cd.md) |
| ChallengeIaC | Infrastructure, service selection, boundary | [`challenge-iac.md`](.challengeai/challenge-iac.md) |
| ChallengeMELT | Metrics, events, logs, traces, alerting | [`challenge-melt.md`](.challengeai/challenge-melt.md) |

## Reading order

Start with [`federal-context.md`](.challengeai/federal-context.md), which covers
what applies to every federal system regardless of stack (and where this
repository specifically opts out, as a non-federal system). Then read the
tool files for the area being worked on.

**Worth reading early:** [`challenge-ui.md`](.challengeai/challenge-ui.md)
and [`challenge-ato.md`](.challengeai/challenge-ato.md) both name a
recurring pattern in this repository's `README.md`/`SECURITY.md` — badges
and prose claiming security/accessibility properties (a SOC 2 badge that's
actually Netlify's own certification, a WCAG 2.1 AA badge with no scan
behind it, a CSP-headers claim with no CSP configured) that don't fully hold
up against the code. Not fixed by this documentation pass; named so it's
visible.

The tool files are deliberately technology-agnostic where they describe a
requirement, so the same reasoning applies whatever the stack. Each also carries
an **In this repository** section that names how this specific system meets it,
which is the part that changes per project.

[`profile.yml`](.challengeai/profile.yml) is the one place that declares
specifics: this system's stack, impact level, control baseline, and gates, in a
form a script can read.

## How to describe it

ChallengeAI is how this system was built, and user-facing copy describes it that
way. The repository saying it was built with ChallengeAI is correct; a page
saying a product feature is powered by ChallengeAI is wrong, because that names
the accelerator as a capability it never was.
