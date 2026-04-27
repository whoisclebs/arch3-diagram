# Official Arch3 notation

## Status

This document defines the official Arch3 notation baseline.

The current generic PlantUML output is explicitly treated as a **discardable
placeholder**. It does **not** count as the Arch3 visual language.

## Purpose

Arch3 is a notation for AI-first architecture modeling. It is designed to be:

- readable by humans
- writable by humans and agents
- parseable without ambiguity
- evolvable across multiple renderers

Arch3 is inspired by the C4 Model, but it is specified as its own notation.
It is not owned by any single renderer.

## Core principles

- specification-first and implementation-independent design
- renderer-independent abstract model
- progressive expansion from overview to detail
- stable identifiers and deterministic semantics
- metadata as first-class architecture context

## Non-goals

- full compatibility with C4, UML, or Structurizr syntax
- direct reuse of third-party visual semantics
- treating generic PlantUML rectangles as the final visual system

## Layers

### Layer 1: Context

Shows actors, systems, and business boundaries.

Rules:

- must not expose low-level technology details
- must focus on value flow and system boundaries

### Layer 2: Containers

Shows deployable/runtime units inside a system.

Rules:

- containers must declare technology
- relationships should describe intent and protocol when relevant
- metadata is mandatory for governance-ready usage

### Layer 3: Components

Shows the internal logical parts of a container.

Rules:

- components belong to exactly one container
- library dependencies may be shown here
- only expand when the extra detail is meaningful

## Core entities

### Actor

- external human or external system
- identity is required

### System

- top-level business or platform capability
- may contain containers

### Container

- deployable or runtime unit
- may contain components
- must support metadata

### Component

- internal module inside a container
- may declare library dependencies

### Boundary

- logical grouping or visual scope
- optional in v0.1, expected to mature in later revisions

## Identity rules

- every element must have a stable `id`
- ids must be unique within a diagram
- ids are semantic references, not presentation labels
- labels may change without changing ids

## Relationship rules

- relationships are directional by default
- each relationship must include a human-readable description
- relationship targets must reference existing ids
- renderer-specific decoration must not change relationship meaning

## Metadata rules

Metadata is part of the notation contract.

At minimum, containers should support fields such as:

- `owner`
- `repo`
- `tier`
- `runtime`

Metadata rules:

- metadata keys must be deterministic strings
- metadata values must be serializable primitives
- renderers may hide metadata visually, but must not drop it semantically

## Expansion rules

Arch3 supports explicit drill-down.

- systems may expand into containers
- containers may expand into components
- expansion must preserve identity continuity between layers
- expansion is semantic, not merely zoom or layout

## Authoring modes

### Canonical mode in v0.1

JSON is the canonical authoring format for v0.1.

Why:

- deterministic structure
- easy parser implementation
- diff-friendly enough for early development
- easy generation by AI systems

### Planned mode in future versions

A dedicated textual DSL may be introduced after the abstract model and
validation contracts stabilize.

## Separation of concerns

The official notation is split into three contracts:

1. **Abstract specification**: entities, layers, semantics, invariants
2. **Canonical model**: JSON structure and validation rules
3. **Renderer contracts**: visual mappings for the PlantUML extension and
   future renderers

No renderer is allowed to redefine the abstract meaning of the notation.

## PlantUML extension

The future PlantUML extension must introduce a **custom Arch3 visual
language**, not plain generic rectangles.

That future contract must include:

- custom stereotypes, sprites, skin parameters, or macros owned by Arch3
- distinct visual treatment for actors, systems, containers, and components
- clear expansion affordances
- a unique visual treatment for library dependencies in layer 3
- metadata callouts that reflect Arch3 semantics instead of generic notes only

## Release plan

### v0.1

- abstract notation baseline
- canonical JSON model
- mandatory identity and relationship rules
- placeholder renderer explicitly deprecated as non-final

### v0.2

- boundary semantics
- stronger metadata conventions
- expansion links across layers
- first visual contract draft for PlantUML

### v1.0

- stable notation spec
- stable validation suite
- first official Arch3 PlantUML extension with custom visual language
- DSL roadmap confirmed

## Acceptance criteria

The notation specification is ready for implementation when:

- syntax and semantics are separable and explicit
- every core rule has valid and invalid examples
- ids, relationships, metadata, and expansion are fully defined
- the renderer contract is explicitly downstream from the abstract model
- the generic PlantUML placeholder is documented as non-compliant with the
  final Arch3 vision
