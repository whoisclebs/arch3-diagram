# Arch3 methodology

Arch3 is the diagramming methodology published by arch3-diagram.

It is inspired by the C4 Model, but defines its own notation, model, and
renderer contracts.

Arch3 is independent from PlantUML. PlantUML is only one extension target for
rendering.

## Goal

Provide a pragmatic, AI-first approach with only three layers:

1. context
2. containers
3. components

## Principles

- versionable diagram as code
- rich metadata on containers
- drill-down expansion from containers to components
- library dependency visibility at component level
- a schema designed for both humans and LLMs
