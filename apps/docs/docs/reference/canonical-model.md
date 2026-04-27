# Canonical model v0.1

## Status

This document defines the canonical Arch3 model for specification version v0.1.

The canonical model is the **source of truth** for parsers, validators,
renderers, tests, and future DSL design.

## Goals

The canonical model must be:

- deterministic
- machine-friendly
- validation-first
- easy to diff and evolve
- independent from any renderer or layout engine

## Canonical format

The canonical authoring format in v0.1 is JSON.

Top-level shape:

```json
{
  "methodology": {},
  "scope": {},
  "context": {},
  "containers": [],
  "components": []
}
```

## Top-level sections

### `methodology`

Required.

Fields:

- `name`: must be `"Arch3"`
- `version`: specification or model version string
- `layers`: ordered list of active layers

Rules:

- `layers` must contain only `context`, `containers`, and `components`
- order must remain stable across serializations

### `scope`

Required.

Fields:

- `name`: human-readable diagram scope title
- `description`: summary of the modeled scope

### `context`

Required.

Fields:

- `actors`: array of `Actor`
- `systems`: array of `System`

### `containers`

Required array.

Each item is a `Container`.

### `components`

Required array.

Each item is a `Component`.

## Entity contracts

### Actor

```json
{
  "id": "shopper",
  "name": "Shopper",
  "description": "Customer who places orders."
}
```

Required fields:

- `id`
- `name`
- `description`

### System

```json
{
  "id": "commerce-suite",
  "name": "Commerce Suite",
  "description": "Primary commerce platform."
}
```

Required fields:

- `id`
- `name`
- `description`

### Container

```json
{
  "id": "checkout-api",
  "system": "commerce-suite",
  "name": "Checkout API",
  "technology": "Node.js",
  "description": "Processes checkout and order workflows.",
  "metadata": {},
  "relationships": []
}
```

Required fields:

- `id`
- `system`
- `name`
- `technology`
- `description`
- `metadata`
- `relationships`

### Component

```json
{
  "id": "checkout-service",
  "container": "checkout-api",
  "name": "Checkout Service",
  "description": "Coordinates validation and persistence.",
  "libraries": ["express", "prisma"],
  "metadata": {},
  "relationships": []
}
```

Required fields:

- `id`
- `container`
- `name`
- `description`
- `libraries`
- `metadata`
- `relationships`

## Shared value objects

### Relationship

```json
{
  "target": "orders-db",
  "description": "Persists orders"
}
```

Required fields:

- `target`
- `description`

Rules:

- `target` must reference an existing addressable id
- the model does not infer reverse relationships automatically

### Metadata

Metadata is a flat JSON object.

Allowed value types in v0.1:

- string
- number
- boolean

Rules:

- nested objects are out of scope in v0.1
- arrays are out of scope in v0.1
- metadata keys are case-sensitive

## Identity invariants

- all ids must be globally unique inside the diagram
- ids must be stable across layer expansion
- ids are the canonical reference keys for all links and future DSL parsing
- ids must not be generated from display labels at render time

## Layer ownership invariants

- actors live only in `context.actors`
- systems live only in `context.systems`
- containers must reference exactly one system
- components must reference exactly one container

## Relationship invariants

- containers may target containers or addressable external elements when later
  introduced by the spec
- components may target components or other addressable elements already
  declared in the model
- unresolved targets are invalid

## Serialization rules

- required keys must always be present
- empty collections must be serialized as empty arrays, not omitted
- metadata must be serialized as an object, even when empty
- canonical examples should prefer stable ordering of sections and arrays

## Validation levels

### Syntax validation

Checks whether the payload is valid JSON.

### Structural validation

Checks whether required sections and field types exist.

### Semantic validation

Checks:

- uniqueness of ids
- ownership references
- relationship targets
- allowed metadata types
- presence of mandatory fields

## Minimal valid example

```json
{
  "methodology": {
    "name": "Arch3",
    "version": "0.1.0",
    "layers": ["context", "containers", "components"]
  },
  "scope": {
    "name": "Example Scope",
    "description": "Minimal valid Arch3 model."
  },
  "context": {
    "actors": [],
    "systems": []
  },
  "containers": [],
  "components": []
}
```

## Out of scope in v0.1

- explicit layout coordinates
- visual style declarations in the model
- nested boundaries with full semantics
- polymorphic metadata schemas
- multiple canonical authoring formats

## Acceptance criteria

The canonical model is ready for implementation when:

- every entity has a required-field contract
- all shared invariants are explicit
- validation can be implemented without renderer assumptions
- at least one minimal valid fixture and invalid fixture set are specified
- future renderers can consume the model without changing its semantics
