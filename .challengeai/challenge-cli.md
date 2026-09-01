# ChallengeCLI

The accelerator itself: the layer that carries the standards in this folder into
Claude and Codex so the work arrives shaped by them.

## Covers

Cross-runtime operation. The same guidance drives both runtimes, which is why
the federal layer lives in `.challengeai/` and the agent files point at it
rather than restating it.

## The requirement

None directly. ChallengeCLI is delivery tooling, and no federal authority
mandates it. It exists so the requirements the other eleven tools cover are
applied while code is written rather than discovered during assessment.

MetaPhase governs the suite under ISO/IEC 42001, the management-system standard
for artificial intelligence, which is what makes its use in federal delivery
defensible.

## One source, two runtimes

Guidance duplicated per runtime drifts, and drift is worse than absence: two
agents then follow two different rule sets while both appear governed. The
federal layer therefore has one home, and each runtime's entry file references
it instead of copying it.

Where a repository maintains parallel agent files, they are kept in agreement
and that agreement is worth enforcing mechanically rather than by habit.

## In this repository

There is no `AGENTS.md` and no `CLAUDE.md` anywhere in this repository as of
this writing — no runtime entry point of any kind, for either Claude Code or
Codex. An agent started directly in this repo today discovers this
`.challengeai/` folder only by being told to look for it or by browsing the
file tree; nothing points here automatically. `README.md` and
`CONTRIBUTING.md` are the only onboarding documents, and neither mentions
ChallengeAI or `.challengeai/`. This is a real, named gap against this
tool's own "one source, two runtimes" principle, worth closing with a root
`AGENTS.md`/`CLAUDE.md` pair as a deliberate maintainer decision — not
something this documentation pass adds unasked.

## Evidence

The folder is the evidence. Someone reading `.challengeai/` can see what the
team was held to without interviewing anyone.

## Review checklist

- Do the parallel agent files still agree with each other?
- Is anything here duplicated into a runtime-specific location, where the two
  copies will drift?
- Has a repository-specific detail leaked into a tool file? It belongs in
  `profile.yml`, this file's `In this repository` section, or the repository's
  own documentation.
- Does user-facing copy describe ChallengeAI as a feature of the product? It is
  how the product was built, and saying otherwise is wrong.
