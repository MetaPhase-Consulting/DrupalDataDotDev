# ChallengeATO

Authorization readiness: whether this system could be assessed today and whether
the evidence would hold.

## Covers

Control traceability, evidence sufficiency, the security package, the privacy
assessment, and bounded penetration testing against a running instance.

## The requirement

- **FISMA** requires federal systems to implement an information security
  program and to be authorized before operating.
- **NIST SP 800-37 Rev. 2** defines the Risk Management Framework.
- **FIPS 199** categorizes the system as low, moderate, or high impact. The
  categorization drives everything downstream, and it is recorded in
  `profile.yml`.
- **NIST SP 800-53 Rev. 5** provides the control baseline the categorization
  selects.
- **NIST SP 800-53A Rev. 5** provides the procedures an assessor uses.
- **The E-Government Act** requires a Privacy Impact Assessment where a
  system handles information **in identifiable form** — not merely
  information "about" individuals in aggregate — or initiates a qualifying
  electronic collection from ten or more non-federal persons.

## The package

A security package is a set, numbered so it can be handed over as one. The
System Security Plan describes the system, its boundary, and how each control is
met. Around it sit the assessment plan and report, the plan of action and
milestones, the risk assessment, the contingency and incident response plans,
configuration management, access control policy, continuous monitoring, and the
privacy impact assessment.

The boundary described in the SSP is the boundary the system actually
provisions. Anything outside it is inherited from the provider's own
authorization and is named as inherited rather than claimed.

## In this repository

No security package exists — no `docs/security/`, no SSP, no FIPS 199
categorization, no POA&M, no PIA. `profile.yml` records `control_baseline:
null` and `impact_level: null` because none is pursued, which is
appropriate for a tool with no accounts, no persistence, and no PII (see
ChallengeSQL) — not a gap this system needs to close, unlike a system that
actually handles federal data.

What's worth checking instead is `SECURITY.md`'s own "Security Measures"
list, since it makes specific, checkable claims rather than staying generic:

| Claim (`SECURITY.md`) | What was actually found |
|---|---|
| "Input Sanitization: All user inputs are sanitized to prevent XSS attacks" | Real. `BaseGenerator.sanitizeString` HTML-entity-escapes (`&`, `<`, `>`, `"`, `'`) every string value before it's embedded into generated code, applied recursively via `sanitizeForCodeGeneration` across the whole data/options object. This claim holds up. |
| "File Upload Validation: Strict file type and size validation for uploads" | Real. `Generator.tsx` checks both MIME type/extension (rejecting anything but `.csv`) and a 10MB size cap before accepting an uploaded file — matches `DataInput.tsx`'s "max 10MB" UI copy exactly. |
| "Content Security Policy: CSP headers to prevent code injection" | Not backed. No `[[headers]]` block in `netlify.toml`, no `<meta http-equiv="Content-Security-Policy">` in `index.html`, no CSP configuration found anywhere in this repository. |
| "Dependency Management: Regular updates of dependencies with security patches" | Partially backed by process, not by a schedule: `ci.yml`'s `security` job runs `npm audit` on every push/PR (real, and blocking — see ChallengeCI), which would surface a new advisory quickly. There's no Dependabot or Renovate configuration (no `.github/dependabot.yml`) automating the updates themselves, though — the audit finds problems; nothing here fixes them automatically. |
| "Secure Defaults: Secure configuration by default" | Too generic to check against anything specific. |
| "HTTPS Enforcement: All traffic encrypted in transit" | Real in practice — Netlify serves everything over HTTPS by default — but that's Netlify's platform behavior, not a setting this repository configures or could disable if it wanted to. Reasonable to claim, worth knowing it's inherited rather than enforced by this codebase. |

`README.md` carries a `Security: SOC 2` badge linking to
`netlify.com/security` — that's **Netlify's own SOC 2 Type II report about
its hosting platform**, not an audit of this application's code or
generated output. Presented alongside this project's own badges without
that distinction, a reader would reasonably assume it describes this
project. See ChallengeUI for the parallel check on the accessibility badge.

## Evidence

- Pipeline output produced on every run: scan results, test reports, and a
  component inventory.
- A traceability record mapping each capability to its implementation and test.
- A reviewable record of the deployed configuration, so the boundary can be
  checked rather than taken on description.

CI produces real scan output (`npm audit`, on every run — see ChallengeCI)
and a real test run (16 unit tests in `dataTransform.test.ts` — see
ChallengeTDD), which is more than several other repos in this suite
produce. No component inventory (SBOM) and no traceability record exist.

## Review checklist

- Does the SSP describe the system as it is now, or as it was at the last
  release?
- Is every control claim backed by something a reader can open?
- Does the boundary in the SSP match what is actually provisioned?
- Has the data model started handling personal information the PIA does not
  mention?
- **A weakness, POA&M item, or vulnerability goes into a security document only
  with explicit approval.** Cataloguing theoretical gaps manufactures a record
  of insecurity. State what is implemented; independent assessment produces the
  authoritative findings. This repository has no security document to add a
  finding to — the table above states what was independently checked
  against the actual code, not a fabricated POA&M.
- **This repository-specific:** before adding a new claim to `SECURITY.md`
  or a new badge to `README.md`, can it be traced to real, checkable code
  or configuration in this repository — and if it describes a third
  party's own certification (like Netlify's SOC 2), is that attribution
  clear rather than implied to be this project's own?
