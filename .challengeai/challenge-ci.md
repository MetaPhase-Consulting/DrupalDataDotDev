# ChallengeCI

The pipeline: what it proves, and whether it can be bypassed.

## Covers

Workflow hardening, evidence gates, security scanning, and the release controls
that make a merge into a protected branch mean something.

## The requirement

SP 800-53 Rev. 5 control families, principally Configuration Management (CM),
System and Information Integrity (SI), and Risk Assessment (RA). An assessor
asks how change is controlled and how flaws are found; a pipeline that gates on
both answers the question with artifacts instead of assertions.

## Gates and reports

A gate blocks a merge. A report informs one. Both are useful and they are not
interchangeable, so which is which is a decision rather than an accident of
configuration.

The gates worth having cover: that the code compiles, conforms and behaves; that
the artifact can actually be produced; that the system works end to end; that
every rendered route passes accessibility; that no dependency carries a high or
critical advisory; and that no verified secret reached the history.

Which of those block, and which report, is declared in `profile.yml` so the
answer is written down rather than inferred from workflow files.

## Hardening

- Workflow permissions are least privilege, declared per workflow rather than
  inherited.
- Actions are pinned, and raised on a schedule.
- Deploy credentials come from short-lived federated identity rather than a
  long-lived key held in the repository or in secrets.
- The pipeline runs on pull requests from forks without secrets in scope.

## In this repository

One workflow, `.github/workflows/ci.yml`, two jobs, both running on every
push and PR to `main` and `dev`:

- **`test`** — lint, unit tests (`vitest run`), and build, run across two
  Node versions (20.x, 22.x). No `continue-on-error` anywhere, so a red
  result on any step fails the job. The build artifact (`dist/`) is
  retained for 7 days, but only from the 20.x matrix leg.
- **`security`** — `npm audit --audit-level=moderate`, then
  `npm audit --audit-level=high --production`. Also no
  `continue-on-error` — **this is genuinely stronger than most repos in
  this suite**, where a dependency scan is typically advisory
  (`continue-on-error: true`). Here, a moderate-or-worse advisory in any
  dependency (dev included, from the first `audit` call) fails the job.

Against this tool's gate list: compile/conform/behave is covered (lint,
test, build). No end-to-end test exists (see ChallengeTDD). No accessibility
check runs despite the README's WCAG badge (see ChallengeUI). The
dependency scan fails its own workflow run on a moderate-or-worse advisory
(no `continue-on-error`), which is a stronger *workflow-level* posture than
most sibling repos have — but "fails the workflow run" and "required to
merge" are different facts, and no branch-protection setting was found
confirming this job actually blocks a merge (see
`profile.yml`'s `documented_but_unverified_branch_protection`). Described
as a failing check, not a confirmed merge gate. No secret-scanning tool
(gitleaks, trufflehog, GitHub secret scanning verification) was found
configured in this workflow.

There is no deploy step in this workflow at all — deployment is Netlify's
own GitHub-integration auto-deploy, entirely outside GitHub Actions (see
ChallengeCD), so this workflow never handles a deploy credential.

Against the hardening checklist specifically:

- **Workflow permissions:** neither job declares a `permissions:` block —
  both run under whatever the repository's default `GITHUB_TOKEN`
  permissions are, not an explicit least-privilege grant.
- **Action pinning:** `actions/checkout@v4`, `actions/setup-node@v4`,
  `actions/upload-artifact@v4` are pinned to major-version tags, not commit
  SHAs. No Dependabot configuration exists to raise them on a schedule (no
  `.github/dependabot.yml`).
- **Deploy credentials:** not applicable to this workflow — there is none
  here (see above and ChallengeCD).

## Evidence

Each run uploads its reports, and they are retained long enough to be asked for.
Coverage is surfaced on the change itself rather than only in a log.

The `test` job's `dist/` artifact (7-day retention, 20.x leg only) is the
only retained artifact. Neither job uploads a test report, a coverage
report (none is generated — see ChallengeTDD), or an audit report; both
results are visible only in the raw Actions log.

## Review checklist

- Does a new job have wider permissions than it needs?
- Is a new action pinned?
- Did a required check get renamed? The name is what branch protection matches,
  so renaming one silently stops it gating.
- Does a job that cannot fail still report, so a required check is satisfied
  rather than left pending forever?
- Does the gate list in `profile.yml` still match what the pipeline runs?
- **This repository-specific:** does a new dependency introduce a
  moderate-or-worse advisory? The `security` job would fail on it today —
  confirm that's still true after any future change to the audit-level
  flags, since loosening them silently weakens the one blocking security
  gate this repository has.
