# Catálogo de fixtures v0.1

## Estado

Este documento lista o conjunto oficial de fixtures para a especificação Arch3
v0.1.

Os fixtures existem para suportar TDD em parsers, validadores, editores e
extensões de renderização.

## Diretório de fixtures

Os fixtures oficiais vivem em:

```text
examples/fixtures/
```

## Fixtures válidos

### `valid/minimal.arch3.json`

O menor modelo Arch3 válido.

### `valid/full.arch3.json`

O principal modelo de referência end-to-end.

### `valid/context-only.arch3.json`

Modelo válido focado na semântica da layer 1.

### `valid/containers-only.arch3.json`

Modelo válido focado na semântica da layer 2.

### `valid/components-expanded.arch3.json`

Modelo válido focado na semântica da layer 3.

## Fixtures inválidos de syntax

### `invalid/syntax/malformed-json.arch3.json`

O parser deve rejeitar JSON malformado.

### `invalid/syntax/truncated-json.arch3.json`

O parser deve rejeitar JSON incompleto.

## Fixtures inválidos de structure

### `invalid/structure/missing-methodology.arch3.json`
### `invalid/structure/missing-scope.arch3.json`
### `invalid/structure/missing-context.arch3.json`
### `invalid/structure/missing-components.arch3.json`

Cada um existe para verificar seções obrigatórias.

## Fixtures inválidos de semantics

### `invalid/semantics/duplicate-ids.arch3.json`
### `invalid/semantics/unknown-target.arch3.json`
### `invalid/semantics/unknown-system.arch3.json`
### `invalid/semantics/unknown-container.arch3.json`
### `invalid/semantics/invalid-metadata-type.arch3.json`
### `invalid/semantics/missing-relationship-description.arch3.json`

Cada um existe para verificar invariantes semânticas.

## Regras de uso

- fixtures válidos devem permanecer estáveis em patch releases
- fixtures inválidos devem falhar de forma determinística
- novas regras devem introduzir novos fixtures
- extensões de render podem adicionar snapshots derivados, mas não mudar o
  significado do fixture
