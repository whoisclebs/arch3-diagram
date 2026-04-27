# Test and acceptance specification v0.1

## Status

This document defines the validation strategy, fixture requirements, and
acceptance criteria for Arch3 specification version v0.1.

It exists to ensure that parser, validator, editor, and rendering extensions
can be implemented with TDD against stable contracts.

## Validation strategy

Validation must happen in independent layers, in this order:

1. **Syntax**
2. **Structure**
3. **Semantics**
4. **Visual compliance**

### 1. Syntax validation

Purpose:

- confirm that the input is valid JSON
- reject malformed input early
- avoid silent repairs

Expected output:

- success with parsed payload
- or an explicit parsing error

### 2. Structure validation

Purpose:

- confirm that the canonical top-level shape is present
- confirm required sections and field types
- confirm entity shapes before semantic interpretation

Expected output:

- success with structurally valid model data
- or explicit structural errors

### 3. Semantic validation

Purpose:

- validate ids, ownership, relationships, metadata, and layer rules
- confirm that the model is meaningful, not only well-formed

Expected output:

- success with a semantically valid Arch3 model
- or explicit semantic errors

### 4. Visual compliance validation

Purpose:

- confirm that a renderer or extension expresses Arch3 semantics visually
- prevent generic output from being treated as final compliance

Expected output:

- compliant, draft-compliant, or placeholder classification

## Required fixture types

### Valid fixtures

The specification must include:

- **minimal valid fixture**
- **full valid fixture**
- **valid context fixture**
- **valid containers fixture**
- **valid components fixture**
- **valid expansion fixture**

### Invalid syntax fixtures

The specification must include examples for:

- malformed JSON
- truncated JSON
- invalid primitive placement

### Invalid structure fixtures

The specification must include examples for:

- missing `methodology`
- missing `scope`
- missing `context`
- missing `containers`
- missing `components`
- missing required entity fields
- invalid field types

### Invalid semantic fixtures

The specification must include examples for:

- duplicate ids
- unknown relationship target
- unknown system reference in a container
- unknown container reference in a component
- invalid metadata value types
- missing relationship descriptions
- elements declared in the wrong layer role

### Visual fixtures

The specification must include:

- **placeholder visual fixture**
- **draft-compliant visual fixture**
- **layer-specific visual fixtures**
- **expansion visual fixtures**
- **regression snapshots**

## Validation matrix

| Dimension | Goal | What to validate | Failure mode |
| --- | --- | --- | --- |
| Syntax | Valid input format | JSON parsing only | parsing error |
| Structure | Canonical shape | required sections, required fields, field types | structural error |
| Semantics | Model correctness | ids, ownership, targets, metadata, layer invariants | semantic error |
| Visual compliance | Arch3 fidelity | entity distinction, layer intent, metadata treatment, expansion treatment | non-compliant classification |

## TDD readiness criteria

The specification is ready for implementation when:

- every rule has at least one valid fixture
- every rule has at least one invalid fixture
- syntax, structure, semantics, and visual compliance are separated
- error categories are predictable and named
- placeholder output is explicitly treated as non-final

## Parser acceptance criteria

The parser is acceptable when:

- it rejects malformed JSON deterministically
- it produces stable parsed output for valid inputs
- it does not perform semantic repairs
- it preserves the canonical shape expected by the validator

## Validator acceptance criteria

The validator is acceptable when:

- it distinguishes structural and semantic failures
- it returns structured issues with code, path, and message
- it enforces required-field contracts
- it enforces global id uniqueness
- it enforces ownership references
- it enforces relationship target validity
- it enforces metadata type rules

## Editor acceptance criteria

The editor is acceptable when:

- it helps author Arch3 source directly
- it exposes official fixtures as reference starting points
- it surfaces syntax and validation feedback clearly
- it helps users understand the notation while editing
- it behaves as a reference authoring environment similar in spirit to Swagger
  Editor

## Rendering extension acceptance criteria

An Arch3 rendering extension is acceptable when:

- it does not redefine Arch3 semantics
- it distinguishes actor, system, container, and component visually
- it preserves relationship direction and description
- it preserves metadata traceability
- it makes expansion visible and understandable
- it can be classified as placeholder, draft-compliant, or fully compliant

## Regression criteria

Future versions must preserve:

- stable meaning of existing entities
- stable meaning of layer ownership
- stable meaning of relationship direction
- stable meaning of metadata keys already specified

Regression tests must detect when:

- invalid input starts being accepted silently
- valid fixtures stop passing
- relationship targets lose enforcement
- metadata rules are weakened unintentionally
- visual output collapses back to generic rendering

## Release acceptance criteria for v0.1

Arch3 specification v0.1 is ready for implementation when:

- official notation is documented
- canonical model is documented
- visual contract is documented
- test and acceptance specification is documented
- at least one minimal valid fixture and one invalid fixture set exist for each
  validation layer
