# Lint rules v0.1

Arch3 lint rules are advisory conventions on top of schema and semantic
validation.

## Current rules

- container ids should use kebab-case
- component ids should use kebab-case
- containers should declare `metadata.owner`
- containers should declare `metadata.tier`
- containers should declare at least one relationship
- components should declare at least one library
- components should declare `metadata.owner`

## Goal

Lint is meant to improve consistency and governance without making the canonical
model invalid.
