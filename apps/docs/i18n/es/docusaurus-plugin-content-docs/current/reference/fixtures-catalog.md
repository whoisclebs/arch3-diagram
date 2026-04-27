# Catálogo de fixtures v0.1

## Estado

Este documento lista el conjunto oficial de fixtures para la especificación
Arch3 v0.1.

Los fixtures existen para soportar TDD en parsers, validadores, editores y
extensiones de render.

## Directorio de fixtures

Los fixtures oficiales viven en:

```text
examples/fixtures/
```

## Fixtures válidos

### `valid/minimal.arch3.json`

El modelo Arch3 válido más pequeño.

### `valid/full.arch3.json`

El modelo principal de referencia end-to-end.

### `valid/context-only.arch3.json`

Modelo válido enfocado en la semántica de layer 1.

### `valid/containers-only.arch3.json`

Modelo válido enfocado en la semántica de layer 2.

### `valid/components-expanded.arch3.json`

Modelo válido enfocado en la semántica de layer 3.

## Fixtures inválidos de syntax

### `invalid/syntax/malformed-json.arch3.json`

El parser debe rechazar JSON malformado.

### `invalid/syntax/truncated-json.arch3.json`

El parser debe rechazar JSON incompleto.

## Fixtures inválidos de structure

### `invalid/structure/missing-methodology.arch3.json`
### `invalid/structure/missing-scope.arch3.json`
### `invalid/structure/missing-context.arch3.json`
### `invalid/structure/missing-components.arch3.json`

Cada uno existe para verificar secciones obligatorias.

## Fixtures inválidos de semantics

### `invalid/semantics/duplicate-ids.arch3.json`
### `invalid/semantics/unknown-target.arch3.json`
### `invalid/semantics/unknown-system.arch3.json`
### `invalid/semantics/unknown-container.arch3.json`
### `invalid/semantics/invalid-metadata-type.arch3.json`
### `invalid/semantics/missing-relationship-description.arch3.json`

Cada uno existe para verificar invariantes semánticas.

## Reglas de uso

- los fixtures válidos deben mantenerse estables en patch releases
- los fixtures inválidos deben fallar de forma determinística
- nuevas reglas deben introducir nuevos fixtures
- las extensiones de render pueden agregar snapshots derivados, pero no cambiar
  el significado del fixture
