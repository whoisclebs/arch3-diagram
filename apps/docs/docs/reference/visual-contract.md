# Visual contract v0.1

## Status

This document defines the future-facing visual contract for Arch3 renderers.

It does **not** describe the current generic PlantUML placeholder. That output
is intentionally considered non-compliant with the final Arch3 visual system.

## Purpose

The visual contract ensures that renderers express Arch3 semantics through a
distinct visual language instead of generic diagram primitives.

## Renderer obligations

Any renderer that claims Arch3 compatibility must:

- preserve the meaning of the canonical model
- render the three layers with distinct visual intent
- keep identity stable across expanded views
- provide first-class visual treatment for metadata and relationships
- avoid collapsing Arch3 semantics into plain undifferentiated rectangles

## Visual primitives

### Actor

Expected semantics:

- external participant
- outside the primary system ownership boundary

Visual requirements:

- clearly distinguishable from systems and containers
- immediately recognizable as an external participant

### System

Expected semantics:

- top-level business or platform capability

Visual requirements:

- larger semantic weight than containers
- visually readable as a business-level unit

### Container

Expected semantics:

- deployable or runtime unit within a system

Visual requirements:

- explicit technology affordance
- metadata-capable presentation
- visually expandable into layer 3

### Component

Expected semantics:

- internal logical unit inside a container

Visual requirements:

- visually subordinate to containers
- capable of showing library dependencies

### Boundary

Expected semantics:

- logical grouping or scope marker

Visual requirements:

- must group without competing with entity nodes
- must remain visually secondary to systems and containers

## Layer-specific expectations

### Layer 1: Context

- business readability takes priority over technical density
- systems and actors must dominate the scene
- technology labels should not become the focus

### Layer 2: Containers

- container shape and technology signal must be clear
- relationships should surface runtime intent and protocol when needed
- metadata must be available without overwhelming the diagram

### Layer 3: Components

- component boundaries must remain readable
- library dependency treatment must be visually distinct from runtime
  relationships
- expansion context must make it obvious which container is being inspected

## Metadata treatment

Metadata is semantically important and must not be treated as decorative only.

Required capabilities:

- support a visual mechanism for key operational metadata
- keep metadata associated with the correct node
- allow renderers to hide or compress metadata while preserving traceability

Recommended metadata priorities in v0.1:

- owner
- repository
- tier
- runtime

## Relationship treatment

Relationships must visually preserve:

- direction
- description
- target identity

Visual rules:

- runtime relationships and library dependencies must not look identical
- relationship labels should be readable without dominating the diagram
- renderer shortcuts must not remove semantic meaning

## Expansion treatment

Expansion is part of the visual contract, not only the data contract.

Required visual outcomes:

- it must be obvious when a system is expanded into containers
- it must be obvious when a container is expanded into components
- the expanded parent must remain identifiable in the derived view

## PlantUML-specific direction

The first official PlantUML extension should introduce Arch3-owned visual
building blocks such as:

- custom stereotypes
- Arch3 macros
- Arch3 skin parameters
- Arch3 sprites or icons when needed

The renderer must not rely on generic PlantUML output alone as the final visual
identity.

## Compliance levels

### Placeholder

- extension is technically functional
- output is generic
- not compliant with the final Arch3 visual contract

### Draft-compliant

- extension introduces Arch3-specific visual semantics
- some visual details may still evolve

### Fully compliant

- extension satisfies the complete Arch3 visual contract for the supported
  layers

## Acceptance criteria

The visual contract is ready for implementation when:

- each entity has a distinct visual role
- each layer has explicit rendering goals
- metadata and relationships have defined treatment rules
- expansion behavior is visually specified
- an extension can be judged compliant or non-compliant without subjective guesswork
