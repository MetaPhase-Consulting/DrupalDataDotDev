# ChallengeIaC

Infrastructure: what is provisioned, what it costs, and where the authorization
boundary falls.

## Covers

Infrastructure as code, FedRAMP service selection, the authorization boundary,
and the cost consequences of a topology.

## The requirement

- **FedRAMP** authorizes cloud service offerings. Using an authorized service at
  the required impact level lets the system inherit the controls that service
  already satisfies.
- **SP 800-53 Rev. 5** Configuration Management, applied to infrastructure: the
  deployed configuration has to be reviewable and controlled.

Inheritance is only valid for services inside the authorized boundary at the
authorized level. Checking that before adopting a service is a design step, not
an assessment finding.

## Declared, not clicked

Infrastructure that exists because someone configured it by hand is
infrastructure nobody can review, reproduce, or diff. Declaring it makes the
deployed state readable, and makes a change to it something that can be
approved.

The declaration is checked for syntax and validity as a gate, and the same
declaration is what gets applied, so the reviewed configuration and the running
one are the same artifact.

## In this repository

This is the simplest topology in this suite: a static site, built by Vite,
served by Netlify. `netlify.toml` is the entire infrastructure declaration
— a build command, a publish directory, and a single SPA-fallback redirect
rule. No IaC tool of any kind is in use (no Terraform, Bicep, CloudFormation),
and none is needed at this scale — there's no compute to provision beyond
what Netlify's build system already manages, no database, no queue, no
network boundary this repository defines.

FedRAMP authorization doesn't bind this choice: this system carries no
federal data on an agency's behalf (see ChallengeATO, federal-context.md),
so Netlify's own authorization status is not a live constraint here the way
it would be for a system actually processing federal information.

## Boundary

What the system provisions is the boundary. Everything else is inherited from
the provider and is named as inherited rather than claimed as implemented.

This system provisions nothing beyond what `netlify.toml` declares. The
custom domain (`drupaldata.dev`) and its DNS configuration live entirely in
Netlify's own dashboard, not in this repository.

## Cost

Cost-relevant settings are variables, each carrying its reasoning. A default was
usually chosen against a measurement, and keeping the reasoning next to it means
the next person changes it knowingly.

Topology drives cost more than instance sizing does, and the expensive parts are
usually the ones added without being noticed: an always-on gateway, a
cross-region transfer, a log stream with no retention.

Nothing here is a cost-relevant variable — a static site with no backend, no
database, and no per-request compute has essentially no cost surface beyond
Netlify's own bandwidth/build-minute pricing, which this repository doesn't
configure or control.

## Evidence

- The infrastructure declaration is the record of what is provisioned.
- Validation results from the pipeline.
- Variables and their reasoning.

`netlify.toml` is real, minimal, and complete evidence of what this
repository provisions — there's genuinely little more to declare at this
system's scale. Nothing in CI validates `netlify.toml` directly; it's only
exercised implicitly by Netlify's own build succeeding or failing at deploy
time.

## Review checklist

- Is this service authorized at the required impact level?
- Does this change move anything across the authorization boundary?
- Is a cost-relevant setting hardcoded rather than declared as a variable with
  its reasoning?
- Does the running configuration still match what is declared?
- Is a new resource missing a retention or lifecycle setting, leaving it at the
  provider default?
- **This repository-specific:** if this system ever grows a backend (see
  ChallengeCD's note on future secrets), does that change also add the IaC
  declaration this simple static-site topology has never needed? A backend
  added the same way the frontend was — configured by hand in a provider
  dashboard — reintroduces exactly the "clicked, not declared" gap this
  tool file currently has nothing to point at.
