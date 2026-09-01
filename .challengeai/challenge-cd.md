# ChallengeCD

Deployment: whether a release can be made safely and undone quickly.

## Covers

Rollout safety, rollback readiness, secrets handling, and the operational
controls around putting a change in front of users.

## The requirement

SP 800-53 Rev. 5 Configuration Management (CM-3 change control, CM-5 access
restrictions for change) and Contingency Planning (CP-10 system recovery). An
authorized system must be able to show that changes are controlled and that a
bad change can be reversed.

## Know where the risk is actually taken

Every deployment model takes the risk somewhere. What matters is that everyone
knows where, because a branch treated as a safety gate that does not gate
anything is worse than no gate: it produces confidence without protection.

Where a promotion redeploys code that is already live, the promotion names a
version rather than de-risking anything, and the risk was taken earlier.

## Rollout and rollback

- **Health-gated rollout**, so a release that never passes its health check
  reverses itself rather than waiting to be noticed.
- **Rollback documented and rehearsed.** A procedure that has never been run is
  a hypothesis.
- **Credentials from short-lived federated identity**, so no long-lived key
  exists to leak or rotate.

A change that cannot be rolled back without also reversing a data migration is
a different class of change, and saying so at review time is the point.

## In this repository

Deployment is Netlify's own GitHub App integration — a push to `main`
triggers a Netlify build and deploy directly, entirely outside GitHub
Actions (`netlify.toml` supplies the build command and publish directory
only; there's no deploy step in `.github/workflows/ci.yml` — see
ChallengeCI). There's no health-gated rollout: Netlify's default model
replaces the live site once the build succeeds, with no automated check of
the deployed result. Rollback is whatever Netlify's dashboard provides
(redeploying a previous build), undocumented as a procedure anywhere in
this repository.

The one genuinely clean fact here: `netlify.toml` needs no build-time
secrets at all, and none are configured. A repository-wide search confirms
zero `import.meta.env`/`process.env` references anywhere in `src/`, and no
`.env` or `.env.example` file exists. There's nothing to leak because
nothing is configured that could leak — a real, structural advantage of a
backend-less, static tool, worth crediting explicitly since it's the
opposite finding from other repos in this suite.

## Secrets

Secrets reach the running system at start from a secret store, never from the
repository and never from a build artifact. The repository is scanned on every
push and on a schedule, and a verified finding fails the build.

A value inlined at build time is baked into whatever ships and is readable by
anyone holding the artifact. That can be an acceptable trade, but it is a
decision to make deliberately rather than discover.

Not applicable — see above. This system holds no secret of any kind, so
there's nothing for this section to review beyond confirming that absence,
which was checked directly rather than assumed.

## Evidence

- Deploy runs recorded per change and retained.
- A release runbook carrying the verification commands and the rollback
  procedure.
- Whatever the platform keeps as the previous good revision is the rollback
  record.

Netlify retains its own deploy history (visible in its dashboard, not in
this repository), which functions as the rollback record by platform
default. No release runbook exists in this repository.

## Review checklist

- Does the deploy watch its own run with a failure exit status? A watch that
  returns success whichever way the run ended will let a failed deploy be tagged
  as a release.
- Is the run identified by commit rather than by branch? A branch filter asked
  seconds after a merge returns the previous run, which is already green.
- Can this change be rolled back without a data migration being reversed? If
  not, say so in the pull request.
- Does anything new read a secret at build time rather than at run time?
- **This repository-specific:** if a future feature introduces any
  environment variable at all (an API key for a new integration, say),
  does it get documented in a new `.env.example`, and — since this app has
  no backend today (see ChallengeIaC, ChallengeAPI) — is a server-side
  component added at the same time to hold it, rather than reading it
  directly in client code the way a purely static app would default to?
  It's easier to establish that habit before there's a real secret to
  protect than after.
