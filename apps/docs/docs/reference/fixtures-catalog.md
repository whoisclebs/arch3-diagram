# Fixtures catalog v0.1

## Status

This document lists the official fixture set for Arch3 specification v0.1.

The fixtures exist to support TDD for parsers, validators, editors, and
rendering extensions.

## Fixture directory

Official fixtures live under:

```text
examples/fixtures/
```

## Valid fixtures

### `valid/minimal.arch3.json`

The smallest valid Arch3 model.

Purpose:

- syntax baseline
- structure baseline
- minimal semantic baseline

### `valid/full.arch3.json`

The main end-to-end reference model.

Purpose:

- full validation coverage
- renderer baseline
- editor baseline

### `valid/context-only.arch3.json`

A valid model focused on layer 1 semantics.

Purpose:

- actor and system coverage
- context rendering scenarios

### `valid/containers-only.arch3.json`

A valid model focused on layer 2 semantics.

Purpose:

- container ownership coverage
- metadata and relationship coverage

### `valid/components-expanded.arch3.json`

A valid model focused on layer 3 semantics.

Purpose:

- component ownership coverage
- library dependency coverage
- expansion scenarios

## Invalid syntax fixtures

### `invalid/syntax/malformed-json.arch3.json`

Purpose:

- parser must reject malformed JSON

### `invalid/syntax/truncated-json.arch3.json`

Purpose:

- parser must reject incomplete JSON

## Invalid structure fixtures

### `invalid/structure/missing-methodology.arch3.json`

Purpose:

- validator must reject missing `methodology`

### `invalid/structure/missing-scope.arch3.json`

Purpose:

- validator must reject missing `scope`

### `invalid/structure/missing-context.arch3.json`

Purpose:

- validator must reject missing `context`

### `invalid/structure/missing-components.arch3.json`

Purpose:

- validator must reject missing `components`

## Invalid semantic fixtures

### `invalid/semantics/duplicate-ids.arch3.json`

Purpose:

- validator must reject global id collisions

### `invalid/semantics/unknown-target.arch3.json`

Purpose:

- validator must reject unresolved relationship targets

### `invalid/semantics/unknown-system.arch3.json`

Purpose:

- validator must reject containers pointing to missing systems

### `invalid/semantics/unknown-container.arch3.json`

Purpose:

- validator must reject components pointing to missing containers

### `invalid/semantics/invalid-metadata-type.arch3.json`

Purpose:

- validator must reject unsupported metadata types

### `invalid/semantics/missing-relationship-description.arch3.json`

Purpose:

- validator must reject relationships without a description

## Usage rules

- valid fixtures must stay stable across patch releases
- invalid fixtures must fail deterministically
- new rules must introduce new fixtures instead of silently changing old ones
- rendering extensions may add visual snapshots derived from these fixtures, but
  must not change fixture meaning
