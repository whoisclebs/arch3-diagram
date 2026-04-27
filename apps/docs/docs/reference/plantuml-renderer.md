# PlantUML extension

The `@arch3/arch3-plantuml` package is a PlantUML extension for Arch3.

Arch3 itself is independent from PlantUML. This package is only one rendering
target for the notation.

## Design constraints

- no dependency on C4-PlantUML
- deterministic aliases
- layer-focused rendering
- optional container expansion into components
- no redefinition of Arch3 semantics inside the renderer
