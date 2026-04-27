# Modelo canónico v0.1

## Estado

Este documento define el modelo canónico de Arch3 para la versión v0.1 de la
especificación.

El modelo canónico es la **fuente de verdad** para parsers, validadores,
renderizadores, pruebas y futuras DSLs.

## Objetivos

El modelo canónico debe ser:

- determinístico
- amigable para máquinas
- orientado a validación
- fácil de versionar y comparar
- independiente de cualquier renderizador o motor de layout

## Formato canónico

En v0.1, el formato canónico de autoría es JSON.

Estructura superior:

```json
{
  "methodology": {},
  "scope": {},
  "context": {},
  "containers": [],
  "components": []
}
```

## Secciones superiores

### `methodology`

Obligatoria.

Campos:

- `name`: debe ser `"Arch3"`
- `version`: string de versión del modelo o de la spec
- `layers`: lista ordenada de capas activas

### `scope`

Obligatoria.

Campos:

- `name`
- `description`

### `context`

Obligatoria.

Campos:

- `actors`
- `systems`

### `containers`

Array obligatorio.

### `components`

Array obligatorio.

## Contratos de entidades

### Actor

Campos obligatorios:

- `id`
- `name`
- `description`

### System

Campos obligatorios:

- `id`
- `name`
- `description`

### Container

Campos obligatorios:

- `id`
- `system`
- `name`
- `technology`
- `description`
- `metadata`
- `relationships`

### Component

Campos obligatorios:

- `id`
- `container`
- `name`
- `description`
- `libraries`
- `metadata`
- `relationships`

## Objetos compartidos

### Relationship

Campos obligatorios:

- `target`
- `description`

Reglas:

- `target` debe referenciar un id existente
- el modelo no infiere relaciones inversas automáticamente

### Metadata

Metadata es un objeto JSON plano.

Tipos permitidos en v0.1:

- string
- number
- boolean

Reglas:

- objetos anidados fuera de alcance en v0.1
- arrays fuera de alcance en v0.1
- las claves son case-sensitive

## Invariantes de identidad

- todos los ids deben ser globalmente únicos dentro del diagrama
- los ids deben permanecer estables entre expansiones de capa
- los ids son claves canónicas para links y parsing futuro

## Invariantes de ownership por capa

- actors viven solo en `context.actors`
- systems viven solo en `context.systems`
- containers deben referenciar exactamente un system
- components deben referenciar exactamente un container

## Invariantes de relaciones

- targets no resueltos son inválidos
- la validación semántica no depende del renderer

## Reglas de serialización

- claves obligatorias siempre presentes
- colecciones vacías deben serializarse como arrays vacíos
- metadata debe serializarse como objeto, incluso vacío

## Niveles de validación

### Validación sintáctica

Comprueba si el payload es JSON válido.

### Validación estructural

Comprueba secciones obligatorias y tipos de campos.

### Validación semántica

Comprueba:

- unicidad de ids
- referencias de ownership
- targets de relaciones
- tipos permitidos de metadata
- presencia de campos obligatorios

## Ejemplo mínimo válido

```json
{
  "methodology": {
    "name": "Arch3",
    "version": "0.1.0",
    "layers": ["context", "containers", "components"]
  },
  "scope": {
    "name": "Example Scope",
    "description": "Minimal valid Arch3 model."
  },
  "context": {
    "actors": [],
    "systems": []
  },
  "containers": [],
  "components": []
}
```

## Fuera de alcance en v0.1

- coordenadas explícitas de layout
- declaraciones de estilo visual dentro del modelo
- boundaries anidados con semántica completa
- esquemas polimórficos de metadata
- múltiples formatos canónicos de autoría

## Criterios de aceptación

El modelo canónico está listo para implementación cuando:

- cada entidad tiene contrato de campos obligatorios
- todas las invariantes compartidas están explícitas
- la validación puede implementarse sin asumir renderer
- existe al menos un fixture mínimo válido y un set de inválidos
- futuros renderizadores pueden consumir el modelo sin cambiar su semántica
