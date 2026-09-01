# ChallengeAC

Agile artifacts: whether what was asked for can be traced to what was built.

## Covers

Acceptance criteria, requirement traceability, ambiguity in what was requested,
and audit readiness of the delivery record.

## The requirement

SP 800-53 Rev. 5 System and Services Acquisition (SA-3, system development life
cycle) and Configuration Management (CM-3, change control). An assessor asks how
the team knows it built what was asked for, and how a change was decided.

## Traceability without ceremony

The requirement is that a capability can be traced to its implementation and its
test. It is not that a particular artifact exists before work starts.

A traceability record written as the work lands describes the system, so it
survives an assessment as written. A backlog written ahead of the work describes
intent, which drifts from what shipped and has to be reconciled against reality
before an assessor can use it. Either can satisfy the requirement; only one is
accurate by construction.

Where the record claims a capability is complete, that claim is checkable. A
partial state written honestly, with a sentence on the shortfall, reads better in
assessment than a completion that an assessor disproves.

## Change control

An assessor asking how a change was controlled is asking for a durable record
that shows what changed, who approved it, and how it was verified. A pull
request carrying one concern, with review and conversation resolution required,
answers that. A pull request carrying several makes the record of why any one of
them landed ambiguous.

## In this repository

There's no formal traceability record — no requirements table, no linked
issue tracker mapping capability to implementation to test. What exists is
real, structured process discipline for an open-source project of this size:
`.github/pull_request_template.md` requires a description, a change-type
checkbox, a "Related Issues" section (`Fixes #`/`Closes #`/`Resolves #`,
linking the PR to an issue), a changes-made list, and a testing checklist.
`.github/ISSUE_TEMPLATE/` has both bug-report and feature-request forms with
`config.yml` present, giving contributors a structured way to open work
items in the first place — real traceability infrastructure, even without a
formal capability-tracking document behind it.

**One specific gap in that template, worth naming precisely:** the PR
template's testing checklist asks for `npm run lint` and `npm run build`
explicitly, but not `npm test` — even though `npm test` (vitest) is a real,
required CI job (see ChallengeCI). A contributor following the template
literally could check every box without ever having run the unit tests
locally, even though CI would still catch a failure before merge.

`CONTRIBUTING.md` (not audited in depth by this tool file — see its own
content directly) describes the expected contribution flow; whether one PR
per concern, review approval, and conversation resolution are actually
enforced by GitHub branch protection isn't verified — see `profile.yml`'s
`gates` section.

## Evidence

- A traceability record mapping each capability to its implementation and test,
  with honest states rather than aspirational ones.
- Change history, one concern per change, with the verification recorded.
- Review approval and conversation resolution enforced rather than optional.

The PR and issue templates are real, structured evidence of intent to trace
changes to issues; no formal capability-to-test mapping exists beyond that.

## Review checklist

- Does the capability that just landed appear in the traceability record,
  naming its implementation and its test?
- Does the record claim completion for something only partly built?
- Does the change record say how it was verified?
- Is more than one concern bundled here, making the record of why it landed
  ambiguous?
- Was something ambiguous resolved by asking, or by guessing and documenting the
  guess?
- **This repository-specific:** does a PR that changes generator or
  sanitization logic actually run `npm test` locally, not just the two
  boxes the PR template checklist currently asks for? Add the missing
  checkbox, or rely on CI catching it — but don't assume the template alone
  ensures it.
