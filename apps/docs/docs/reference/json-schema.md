# JSON Schema v0.1

## Status

Arch3 v0.1 now includes an official JSON Schema for the canonical model.

The schema exists to support:

- structural validation
- tooling interoperability
- editor feedback
- automated contract testing

## Scope

The schema validates the canonical JSON shape for:

- `methodology`
- `scope`
- `context`
- `containers`
- `components`

It enforces:

- required top-level sections
- required entity fields
- object shape boundaries
- primitive metadata values
- relationship field presence

## Package location

The schema is published by `@arch3/arch3-model`.

Primary source:

```text
packages/arch3-model/src/schema/arch3.schema.json
```

Package export:

```text
@arch3/arch3-model/schema
```

## Validation layers

JSON Schema covers **structural validation**.

It does not replace semantic validation for:

- duplicate ids
- unknown system references
- unknown container references
- unknown relationship targets

Those rules still belong to the Arch3 validator.

## Current guarantees

The schema guarantees that:

- the top-level model shape is present
- `methodology.name` is `Arch3`
- `layers` values stay inside the allowed set
- metadata values remain primitive
- entities do not accept undeclared fields

## Relationship with the validator

The recommended validation flow is:

1. parse JSON
2. validate against JSON Schema
3. run Arch3 semantic validation

This keeps structural and semantic validation cleanly separated.
