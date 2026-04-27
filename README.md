# arch3-diagram

arch3-diagram is an open source project for **Arch3**, an architecture
diagramming methodology inspired by the C4 Model.

Inspired by successful open source products, this repository is organized as a
pragmatic toolchain with clear package boundaries, working examples, and docs
that scale with the product.

## Why arch3-diagram exists

Most architecture diagramming tools are either too generic, too coupled to a
legacy notation, or not designed for AI-assisted workflows. arch3-diagram aims
to provide:

- a diagramming methodology with its own notation and renderer contracts
- AI-first diagram as code with predictable structure
- rich container metadata for ownership, runtime, and governance
- component-level library dependency visibility
- renderer independence, with PlantUML supported through an extension layer

## What Arch3 is

Arch3 is the modeling approach defined by this project.

1. **Context**: actors, systems, and business boundaries
2. **Containers**: deployable units, runtime topology, and infrastructure
3. **Components**: internal modules and library dependencies inside a container

Arch3 is independent from PlantUML. PlantUML is only one downstream rendering
target through the `@whoisclebs/arch3-plantuml` extension.

## Editor strategy

The web editor follows the same high-level strategy as Swagger Editor:

- write the source notation directly
- validate the structure continuously
- preview rendered output while learning the syntax
- use the editor as a reference authoring environment, not as the methodology
  itself

## Repository structure

```text
apps/
  docs/           Docusaurus documentation site
  editor-web/     React editor for arch3-diagram
packages/
  arch3-dsl/      diagram-as-code parsing and serialization
  arch3-model/    Arch3 schema, types, validation, and canonical examples
  arch3-plantuml/ PlantUML rendering engine
examples/
  commerce.arch3.json
```

## Getting started

### Requirements

- Node.js 18+
- npm 10+

### Install

```bash
npm install
```

### Run the editor

```bash
npm run dev:editor
```

### Run the docs

```bash
npm run dev:docs
```

### Validate the repository

```bash
npm run typecheck
npm run test
npm run build
```

## Current scope

The current milestone delivers:

- initial TypeScript packages for model, DSL, and PlantUML rendering
- a React editor wired to the new Arch3 model
- multilingual Docusaurus docs in English, Spanish, and Brazilian Portuguese
- foundational open source governance documents

## Open source

arch3-diagram is licensed under the MIT License.

- Repository: https://github.com/whoisclebs/arch3-diagram
- Issues: https://github.com/whoisclebs/arch3-diagram/issues
- Security policy: ./SECURITY.md

## GitHub Packages

Published packages use the `@whoisclebs` scope on GitHub Packages:

- `@whoisclebs/arch3-model`
- `@whoisclebs/arch3-dsl`
- `@whoisclebs/arch3-plantuml`
- `@whoisclebs/arch3-cli`
