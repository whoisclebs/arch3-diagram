# PlantUML extension

The `@whoisclebs/arch3-plantuml` package is a PlantUML extension for Arch3.

Arch3 itself is independent from PlantUML. This package is only one rendering
target for the notation.

## Design constraints

- no dependency on C4-PlantUML
- deterministic aliases
- layer-focused rendering
- optional container expansion into components
- no redefinition of Arch3 semantics inside the renderer

## Current implementation stage

The current extension is moving from **placeholder** toward **draft-compliant**.

It already introduces:

- Arch3-owned PlantUML macros
- Arch3-specific stereotypes and skin parameters
- distinct treatment for actors, systems, containers, components, and libraries
- separate visual treatment for library dependencies in layer 3

## Regression snapshots

The renderer is backed by committed `.puml` snapshots for key fixtures.

Snapshot location:

```text
examples/snapshots/plantuml/
```

This helps keep the extension deterministic while the visual contract evolves.
