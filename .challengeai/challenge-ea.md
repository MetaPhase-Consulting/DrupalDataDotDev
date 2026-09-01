# ChallengeEA

Enterprise architecture: whether the system fits the environment it has to live
in.

## Covers

Federal architecture alignment, governance rigor, interoperability with agency
systems, and the traceability between a mission need and a technical choice.

## The requirement

- **The Clinger-Cohen Act** requires agencies to manage IT as a capital
  investment, with architecture as part of that discipline.
- **OMB Circular A-130** sets expectations for managing federal information
  resources.
- **The Federal Enterprise Architecture Framework** provides the reference
  models an agency maps its systems against.
- **The Federal Source Code Policy** governs custom-developed code, including
  reuse and, where applicable, release.

## Reasoning travels with the component

An architecture record that captures only the decision leaves the next team to
rediscover the constraint that produced it, and rediscovery usually happens by
reversing the decision and hitting the constraint again.

So each significant choice carries the alternatives that were considered and why
they were not taken, kept next to the description of the component rather than
in a separate decision archive, where somebody changing it will actually
encounter it.

## In this repository

There's no `docs/architecture/` or equivalent; `README.md`'s "Project
Structure" section is the closest thing to an architecture record, and it's
accurate as far as it goes (see ChallengeCI, ChallengeUI for where its other
claims fall short).

The actual shape: a fully client-side React SPA with no backend of any kind
(see ChallengeIaC, ChallengeSQL). The generator's core abstraction is
`src/services/CodeGenerator.ts` dispatching to one of four output-format
generators (`JavaScriptEmbedGenerator`, `StaticHTMLGenerator`,
`DrupalBlockGenerator`, `DrupalControllerGenerator`), all extending a shared
`BaseGenerator` that centralizes HTML-entity sanitization (see ChallengeUI's
sanitization note, ChallengeAPI). A distinct, worth-naming architectural
fact: `src/data/libraries.json` lists six charting/mapping libraries the
generator can target (Chart.js, D3.js, Highcharts, Apache ECharts,
OpenLayers, Leaflet), but only two of them — Chart.js and D3 — are actual
npm dependencies used for the in-app live preview. The other four are
code-generation targets only: the app emits template code referencing them
(typically loaded via CDN in the generated output) without installing,
bundling, or executing them itself. That's a real, deliberate design choice
— it's why `package.json` doesn't list Highcharts/ECharts/OpenLayers/Leaflet
as dependencies despite the README and this system's own `libraries.json`
naming all six as "supported" — but it isn't written down anywhere as a
decision with its reasoning; this file is the first place it's stated
explicitly.

**One specific duplication worth naming as a "reasoning travels with the
component" case study:** the sanitization logic that closes the XSS risk in
generated code (`sanitizeString`/`sanitizeForCodeGeneration`) exists as
byte-for-byte identical, separately maintained copies in
`BaseGenerator.ts` and directly inline in `Generator.tsx` — not shared via
import. A future fix to one (an escaped character added, a bug found) has
no mechanism forcing it into the other; the two will drift silently unless
someone remembers both exist. See ChallengeAPI for why this specific logic
is security-critical.

No alternatives-considered record exists for any architectural choice here —
this section is reconstructed from the code, not read from a design
document.

There is no agency mission need this traces to, and no live integration
with any agency system.

## Boundaries the architecture has to respect

- **The authorization boundary** is what the system provisions and controls. A
  component added outside it changes the security posture and the
  documentation that describes it.
- **Data stays inside the provider boundary** unless a deliberate decision says
  otherwise, and that decision is recorded with its reasoning.
- **Services are chosen from what is authorized** at the required impact level,
  checked before adoption.

Not applicable in the ATO sense — see ChallengeIaC for what this system
actually runs on (a static site on Netlify, no authorization boundary of its
own).

## Interoperability

Where the system exchanges data with an agency system, the interface is
documented as a contract with a version, and the failure behaviour is
specified. An integration whose failure mode is unspecified becomes an
incident rather than a degraded state.

No live integration with any external system exists — the app processes
user-supplied CSV/JSON entirely client-side and produces code as output; it
doesn't call out to any API at runtime.

## Evidence

- Architecture documentation carrying the design and its reasoning.
- A reviewable record of what is actually provisioned.
- The published interface contract.

None of the three exists as a dedicated document; the code itself and this
tool file are the closest things to evidence.

## Review checklist

- Does this choice have its reasoning recorded next to it?
- Were alternatives considered, and is the reason for not taking them written
  down?
- Does a new component sit inside the authorization boundary?
- Does data leave the provider boundary, and was that decided or assumed?
- Does a new integration specify what happens when the other side is down?
- **This repository-specific:** does adding a new output-format generator
  extend `BaseGenerator` and route its output through the shared
  sanitization path, the way all four existing generators do? A generator
  written outside that pattern would reintroduce the XSS risk
  `sanitizeForCodeGeneration` exists specifically to close — see
  ChallengeAPI.
