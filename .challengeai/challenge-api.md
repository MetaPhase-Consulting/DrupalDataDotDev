# ChallengeAPI

The API: its contract, what it accepts, and what it discloses.

## Covers

API contracts, input validation, interoperability, versioning, rate limiting,
and federal API governance.

## The requirement

- **SP 800-53 Rev. 5** System and Communications Protection (SC) and System and
  Information Integrity (SI-10, input validation).
- **The Federal Source Code Policy and API guidance** expect government APIs to
  be documented, versioned, and stable for the people who build against them.
- **OMB guidance on open data** expects machine-readable access where the data
  is public.

## The contract

An API is a promise to people who cannot be consulted before it changes.

- **Versioned in the path**, moving independently of the product release, so
  adding a version does not by itself require a major release of the system.
- **Published as a machine-readable document**, so a client can generate against
  it rather than read prose.
- **Validated at the edge of the process.** Every parameter is parsed and
  bounded before it reaches a query. Unbounded pagination and unbounded result
  sizes are both denial-of-service vectors and cost vectors.
- **Health reported against dependencies**, not just process liveness. A process
  that is up and cannot reach its data is not healthy.
- **Rate limited at the edge**, so a burst is refused rather than queued.

## Errors

An error names what was wrong with the request without describing the internals
of the system. A stack trace, a driver message, or a query fragment in a
response body is an information disclosure finding.

## In this repository

There is no API — no backend, no server-rendered route, nothing this
repository exposes over the network beyond the static built site itself
(see ChallengeIaC). Everything runs in the browser: CSV/JSON parsing
(`papaparse`), chart preview rendering, and code generation are all
client-side, with no request/response cycle to a server this project
controls.

**The closest analog worth reviewing with this tool's questions in mind is
the generated code output itself** — what the app hands back to the user as
a download or copy-paste, rather than a network response:

- **Validated at the edge:** partial, and narrower than it looks. Uploaded
  CSV gets a real size cap (10MB, strictly enforced) but a weaker type
  check than "strict" — `text/plain` is accepted as a valid MIME type
  regardless of extension, and any `.csv`-named file is accepted
  regardless of its actual MIME type (see ChallengeATO's corrected table).
  Sanitization is real but *narrower than "every string value"*:
  `CodeGenerator.ts` only calls `sanitizeForCodeGeneration` on `data` and
  `selectedOptions` — every other config field, including
  `selectedLibrary`, is spread through untouched. `selectedLibrary` can be
  set directly from a URL query parameter with no validation
  (`Generator.tsx`'s `initializeFromUrl`) and gets interpolated unescaped
  into `StaticHTMLGenerator`'s generic-fallback `<title>` tag and script
  comments — a real, working XSS path via a crafted share link, not a
  theoretical gap. See ChallengeATO for the full writeup and ChallengeEA
  for the duplicated-sanitizer angle.
- **Versioning:** not applicable — there's no published contract to version.
  The generated code's shape can change between releases with no
  compatibility guarantee to anyone who saved output from an earlier version.
- **Published as a machine-readable document:** not applicable — nothing
  here is a contract a client generates against.
- **Health / rate limiting:** not applicable — there's no server-side
  process or endpoint to report health or limit request rate on. The only
  rate-limit-shaped concern is client-side performance on very large CSV
  uploads, bounded by the existing 10MB cap.
- **Errors:** `Generator.tsx` surfaces user-facing error messages (invalid
  file type, file too large, parse failures) directly in the UI rather than
  as an API response — no internal detail (stack traces, file paths) was
  found leaking into any user-visible error message during this review.

## Evidence

- The published contract document.
- Route tests exercising the documented behaviour, including failure cases.

Neither applies in the usual sense. `dataTransform.test.ts` (see
ChallengeTDD) is the closest evidence this repository has for validated
behavior, though it covers data transformation, not the sanitization path
specifically.

## Review checklist

- Is every new parameter validated and bounded?
- Does a new route appear in the contract document in the same pull request?
- Does an error response leak an internal detail?
- Does a change alter the shape of an existing response? That is a breaking
  change to a published contract, and it belongs behind a new version.
- Is anything personal placed in a URL, where it reaches logs and history?
  **This repository already does this** — "Copy Share Link" puts the
  entire dataset in the URL query string (see ChallengeSQL, ChallengeATO).
- **This repository-specific:** does every config field that reaches a
  generator's template output — not just `data` and `selectedOptions`, but
  `selectedLibrary`, `selectedOutputFormat`, and any field added later —
  get routed through `sanitizeForCodeGeneration` before interpolation? The
  current gap (`selectedLibrary` bypassing it entirely, reachable via a URL
  parameter) shows that "sanitize before generating" isn't yet a rule
  applied to the whole config object, just to two fields of it.
