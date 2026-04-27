# Text DSL v0.1

Arch3 now includes a first textual DSL in addition to JSON.

## Goals

- provide a human-authored source format
- stay easy to parse deterministically
- map directly to the canonical model

## Current syntax

Commands are line-based.

```text
methodology Arch3 0.1.0 context containers components
scope "Commerce Suite" "Full reference fixture for Arch3 v0.1."
actor shopper "Shopper" "Customer who places orders."
system commerce-suite "Commerce Suite" "Primary commerce platform."
container web-app commerce-suite "Web App" "React" "Customer-facing purchase experience." owner=experience-squad tier=critical
component checkout-page web-app "Checkout Page" "Checkout form and cart orchestration." libs=react-router,zustand,zod criticalFlow=true
rel web-app checkout-api "Sends checkout requests"
```

## Supported commands

- `methodology`
- `scope`
- `actor`
- `system`
- `container`
- `component`
- `rel`

## Notes

- quoted strings preserve spaces
- metadata uses `key=value`
- component libraries use `libs=a,b,c`
- comments start with `#`

## Status

This DSL is intentionally minimal in v0.1. It is enough to support authoring,
tests, editor integration, and CLI validation.

## AST support

The DSL parser now exposes an explicit AST before conversion into the canonical
model. This keeps text parsing, model building, and validation as separate
concerns.

## Editor support

The reference editor now provides:

- Arch3 DSL language mode
- syntax highlighting for commands, strings, metadata, and libraries
- basic command completions
- live validation while editing
