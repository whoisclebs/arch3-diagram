# Especificación de pruebas y aceptación v0.1

## Estado

Este documento define la estrategia de validación, los fixtures requeridos y
los criterios de aceptación para la versión v0.1 de la especificación Arch3.

Existe para garantizar que parser, validador, editor y extensiones de render
puedan implementarse con TDD sobre contratos estables.

## Estrategia de validación

La validación debe ocurrir en capas independientes, en este orden:

1. **Syntax**
2. **Structure**
3. **Semantics**
4. **Visual compliance**

### 1. Validación sintáctica

- confirmar que la entrada es JSON válido
- rechazar input malformado temprano
- evitar reparaciones silenciosas

### 2. Validación estructural

- confirmar la forma canónica superior
- confirmar secciones obligatorias y tipos correctos
- confirmar shapes de entidades antes de interpretar semántica

### 3. Validación semántica

- validar ids, ownership, relaciones, metadata y reglas por capa
- confirmar que el modelo tiene significado, no solo forma

### 4. Validación de cumplimiento visual

- confirmar que un renderer o extensión expresa visualmente la semántica Arch3
- impedir que salida genérica sea tratada como cumplimiento final

## Tipos obligatorios de fixtures

### Fixtures válidos

- **minimal valid fixture**
- **full valid fixture**
- **valid context fixture**
- **valid containers fixture**
- **valid components fixture**
- **valid expansion fixture**

### Fixtures inválidos de syntax

- JSON malformado
- JSON truncado
- ubicación inválida de primitivos

### Fixtures inválidos de structure

- falta `methodology`
- falta `scope`
- falta `context`
- falta `containers`
- falta `components`
- faltan campos obligatorios
- tipos inválidos

### Fixtures inválidos de semantics

- ids duplicados
- relationship target inexistente
- referencia de system inválida
- referencia de container inválida
- tipos de metadata inválidos
- relationship sin descripción
- elementos en rol de capa incorrecto

### Fixtures visuales

- **placeholder visual fixture**
- **draft-compliant visual fixture**
- **layer-specific visual fixtures**
- **expansion visual fixtures**
- **regression snapshots**

## Matriz de validación

| Dimensión | Objetivo | Qué validar | Falla esperada |
| --- | --- | --- | --- |
| Syntax | Formato válido | parseo JSON | error de parsing |
| Structure | Forma canónica | secciones obligatorias, campos, tipos | error estructural |
| Semantics | Corrección del modelo | ids, ownership, targets, metadata, invariantes | error semántico |
| Visual compliance | Fidelidad Arch3 | distinción de entidades, intención por capa, metadata, expansión | clasificación no conforme |

## Criterios de preparación para TDD

La especificación está lista para implementación cuando:

- cada regla tiene al menos un fixture válido
- cada regla tiene al menos un fixture inválido
- syntax, structure, semantics y visual compliance están separados
- las categorías de error son predecibles y nombradas
- la salida placeholder está marcada explícitamente como no final

## Criterios de aceptación del parser

El parser es aceptable cuando:

- rechaza JSON malformado de forma determinística
- produce salida estable para entradas válidas
- no realiza reparaciones semánticas
- preserva la forma canónica esperada por el validador

## Criterios de aceptación del validador

El validador es aceptable cuando:

- distingue fallas estructurales y semánticas
- devuelve issues estructurados con code, path y message
- aplica contratos de campos obligatorios
- aplica unicidad global de ids
- aplica referencias de ownership
- aplica validez de relationship targets
- aplica reglas de tipos para metadata

## Criterios de aceptación del editor

El editor es aceptable cuando:

- ayuda a escribir la fuente Arch3 directamente
- expone fixtures oficiales como puntos de partida de referencia
- muestra con claridad feedback de syntax y validación
- ayuda a entender la notación mientras se edita
- funciona como entorno de autoría de referencia, similar en espíritu a Swagger
  Editor

## Criterios de aceptación de la extensión de render

Una extensión de render Arch3 es aceptable cuando:

- no redefine la semántica de Arch3
- distingue visualmente actor, system, container y component
- preserva dirección y descripción de relaciones
- preserva trazabilidad de metadata
- hace visible y comprensible la expansión
- puede clasificarse como placeholder, draft-compliant o fully compliant

## Criterios de regresión

Las versiones futuras deben preservar:

- significado estable de las entidades existentes
- significado estable del ownership por capa
- significado estable de la dirección de relaciones
- significado estable de las keys de metadata ya definidas

Las pruebas de regresión deben detectar cuando:

- input inválido pasa a aceptarse silenciosamente
- fixtures válidos dejan de pasar
- se pierde enforcement de relationship targets
- reglas de metadata se debilitan sin intención
- la salida visual colapsa nuevamente a render genérico

## Criterios de aceptación de release v0.1

La especificación Arch3 v0.1 está lista para implementación cuando:

- official notation está documentada
- canonical model está documentado
- visual contract está documentado
- test and acceptance specification está documentado
- existe al menos un minimal valid fixture y un set inválido por cada capa de
  validación
