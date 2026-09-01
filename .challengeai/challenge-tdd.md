# ChallengeTDD

The tests: what they prove, and what a green run actually means.

## Covers

Test traceability to capabilities, coverage of the paths that matter, and
release readiness.

## The requirement

SP 800-53 Rev. 5 System and Services Acquisition (SA-11, developer testing) and
System and Information Integrity (SI-2, flaw remediation). An assessor asks how
the team knows the system works, and expects an answer with artifacts.

## Breadth, then depth

Breadth across every kind of test comes first, so no category is missing: logic
in isolation, rendered behaviour, accessibility per route, real queries against
a real migrated database, route behaviour including failure cases, and the whole
system end to end at more than one viewport.

Depth follows risk. The paths where a defect changes what a user is shown, or
lets someone reach data they should not, earn the most.

## What a test should assert

A test that passes against a deliberately broken implementation is worse than no
test, because it reports confidence it has not earned. When adding a regression
test, break the fix on purpose and confirm the test fails.

A test asserting an implementation detail rather than a behaviour will break on
a harmless refactor and be deleted by whoever it inconveniences, which costs the
coverage it was written for.

## Traceability

A capability with no test named against it is either untested or untraceable,
and both are findings. The traceability record maps each capability to its
implementation and its test, which is what an assessor asks for.

## In this repository

There's exactly one test file — `src/utils/dataTransform.test.ts`, 16 real
`it()` cases across three `describe` blocks (validation helpers, conversion
helpers, and `convertDataForLibrary`) — covering GeoJSON/Chart.js format
validation and data conversion between chart library formats (Highcharts,
ECharts, D3). It's real, targeted testing of genuinely tricky logic (format
conversion has a lot of edge cases), and it runs in CI on every push/PR
across two Node versions with no `continue-on-error` (see ChallengeCI) — a
real, enforced gate, better than most repos in this suite have.

**What it doesn't cover is the one place this repository has an actual
security control:** `sanitizeString`/`sanitizeForCodeGeneration` — the
HTML-entity-escaping that prevents XSS in generated code output (see
ChallengeAPI, ChallengeEA) — has zero test coverage, in either of its two
duplicated implementations (`BaseGenerator.ts` and `Generator.tsx`). No test
asserts that a malicious string (`<script>`, a quote-breaking attribute
value) actually comes out escaped. If a future refactor broke the escaping
— or if the duplication ChallengeEA names lets the two copies drift and
only one gets fixed — nothing in this test suite would catch it.

There's no component/rendered-UI test, no accessibility assertion (see
ChallengeUI), and no end-to-end test of the generator flow itself
(upload → configure → generate → download).

## Evidence

- Coverage reported on every change.
- End-to-end and accessibility reports retained as artifacts.
- The traceability record.

No coverage tool is configured (no `@vitest/coverage-v8` in
devDependencies, no coverage script), so even the one real test file's
coverage percentage isn't measured or retained anywhere. CI does retain a
build artifact (`dist/`, 7-day retention — see ChallengeCI) but that's a
build output, not a test report.

## Review checklist

- Does the new capability appear in the traceability record, naming its test?
- Would this test fail if the behaviour regressed? Confirm, do not assume.
- Does a database test run against a real schema rather than a mock?
- Is a test asserting an implementation detail that will break on a harmless
  refactor?
- **This repository-specific:** before trusting the sanitization logic in a
  new PR, add a test that feeds `sanitizeString`/`sanitizeForCodeGeneration`
  a string containing `<`, `>`, `&`, `"`, and `'`, and asserts the escaped
  output — the one gap this file names most directly, and the cheapest one
  to close.
