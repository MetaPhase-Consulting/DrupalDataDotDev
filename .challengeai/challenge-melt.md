# ChallengeMELT

Metrics, events, logs, and traces: whether an operator can tell what happened.

## Covers

Observability coverage, alerting, audit logging, retention, and runbooks.

## The requirement

- **SP 800-53 Rev. 5** Audit and Accountability (AU) is the core family: what is
  recorded, protected, retained, and reviewed.
- **The Federal Records Act** governs retention and disposition. Records are kept
  on a schedule rather than until storage becomes inconvenient.
- **Incident Response (IR)** depends on this: an incident that cannot be
  reconstructed cannot be reported accurately.

## What gets recorded

- **Audit records are tamper evident and retained on a schedule**, not rotated
  by size. They exist to be read later by somebody investigating something.
- **Application logs carry no personal information and no secrets.** A log line
  is a permanent record in an environment where records are discoverable.
- **Absence is monitored as well as failure.** A scheduled job that stops
  running produces no errors at all, so the alarm is on the job not having run
  rather than on it having failed.

## Alerting

An alarm fires on a condition an operator can act on. An alarm nobody acts on
trains people to ignore alarms, which leaves the system worse off than having no
alarm at all.

Every alarm therefore has an action attached, and that action lives in a runbook
carrying the actual commands rather than describing them.

## In this repository

There is no logging, metrics, or tracing of any kind — no server exists to
log anything (see ChallengeIaC, ChallengeSQL), and the client-side app
itself doesn't call out to any logging or analytics service. A
repository-wide search confirms no analytics script, no error-tracking SDK
(Sentry or similar), and no telemetry call anywhere in `src/` or
`index.html`.

That's structurally appropriate for what this system is: nothing happens
here that would need reconstructing after an incident in the SP 800-53 AU
sense — no accounts to compromise, no data at rest to exfiltrate, no
server-side process to fail silently. The one place an operator might
actually want visibility — whether the client-side sanitization is ever
bypassed, or whether a generated-code download later turns out to have
carried unescaped input — has no instrumentation at all, but that's a
testing gap (see ChallengeTDD) more than an observability one, since
there's no runtime for a log line to exist in.

There is no scheduled job in this repository, so "absence is monitored" has
nothing to apply to.

## Retention

Retention is a decision with a records-schedule basis, recorded where the log
is configured. Changing it is a compliance change, not a cost optimization.

Not applicable — no log stream exists to have a retention setting. The one
retained artifact in this repository, the CI build output
(`dist/`, 7 days — see ChallengeCI), is a build artifact, not a log.

## Evidence

- Alarm definitions declared as code, so they are reviewable.
- Runbooks versioned with the system.
- Retention declared rather than left at a provider default.

None of the three exists, and none is currently warranted given what this
system actually does.

## Review checklist

- Does a new log line carry anything personal, or any secret?
- Does a new scheduled task have an alarm on it not running?
- Does a new alarm have an action, or does it only notify?
- Is retention on a new log stream declared?
- Would this incident be reconstructable from what is recorded today?
- **This repository-specific:** if a future backend is added (see
  ChallengeCD, ChallengeIaC's forward-looking notes), does it come with
  real logging from day one, rather than shipping the same
  "nothing is logged" default that's appropriate for today's fully
  client-side app but wouldn't be once a server exists to have something
  go wrong on?
