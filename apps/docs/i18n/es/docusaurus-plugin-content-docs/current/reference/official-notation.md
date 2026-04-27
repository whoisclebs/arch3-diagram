# Notación oficial de Arch3

## Estado

Este documento define la línea base oficial de la notación Arch3.

La salida actual en PlantUML genérico se trata explícitamente como un
**placeholder descartable**. **No** cuenta como el lenguaje visual final de
Arch3.

## Propósito

Arch3 es una notación para modelado arquitectónico AI-first. Está diseñada para
ser:

- legible por humanos
- escribible por humanos y agentes
- parseable sin ambigüedad
- evolutiva entre múltiples renderizadores

Arch3 está inspirada en el C4 Model, pero se especifica como una notación
propia. No depende de un renderer único.

## Principios centrales

- diseño guiado por especificación e independiente de implementación
- modelo abstracto independiente del renderizador
- expansión progresiva desde visión general hasta detalle
- identificadores estables y semántica determinística
- metadatos como contexto arquitectónico de primera clase

## No objetivos

- compatibilidad total con sintaxis de C4, UML o Structurizr
- reutilizar directamente semántica visual de terceros
- tratar rectángulos genéricos de PlantUML como sistema visual final

## Capas

### Capa 1: Contexto

Muestra actores, sistemas y límites de negocio.

Reglas:

- no debe exponer detalles tecnológicos de bajo nivel
- debe enfocarse en flujo de valor y límites del sistema

### Capa 2: Contenedores

Muestra unidades de runtime o despliegue dentro de un sistema.

Reglas:

- los contenedores deben declarar tecnología
- las relaciones deben describir intención y protocolo cuando aplique
- los metadatos son obligatorios para un uso orientado a gobernanza

### Capa 3: Componentes

Muestra las partes lógicas internas de un contenedor.

Reglas:

- los componentes pertenecen a exactamente un contenedor
- las dependencias de librerías pueden mostrarse aquí
- solo se debe expandir cuando el detalle adicional sea útil

## Entidades centrales

### Actor

- humano externo o sistema externo
- identidad obligatoria

### System

- capacidad de negocio o plataforma de alto nivel
- puede contener contenedores

### Container

- unidad desplegable o de runtime
- puede contener componentes
- debe soportar metadatos

### Component

- módulo interno dentro de un contenedor
- puede declarar dependencias de librerías

### Boundary

- agrupación lógica o alcance visual
- opcional en v0.1, con evolución prevista en versiones posteriores

## Reglas de identidad

- cada elemento debe tener un `id` estable
- los ids deben ser únicos dentro del diagrama
- los ids son referencias semánticas, no labels de presentación
- los labels pueden cambiar sin cambiar los ids

## Reglas de relaciones

- las relaciones son direccionales por defecto
- cada relación debe incluir una descripción legible por humanos
- los targets deben referenciar ids existentes
- la decoración específica del renderizador no debe cambiar el significado

## Reglas de metadatos

Los metadatos forman parte del contrato de la notación.

Como mínimo, los contenedores deben soportar campos como:

- `owner`
- `repo`
- `tier`
- `runtime`

Reglas:

- las claves deben ser strings determinísticos
- los valores deben ser primitivos serializables
- los renderizadores pueden ocultarlos visualmente, pero no perderlos
  semánticamente

## Reglas de expansión

Arch3 soporta drill-down explícito.

- los sistemas pueden expandirse a contenedores
- los contenedores pueden expandirse a componentes
- la expansión debe preservar continuidad de identidad entre capas
- la expansión es semántica, no solo zoom o layout

## Modos de autoría

### Modo canónico en v0.1

JSON es el formato canónico de autoría para v0.1.

### Modo planeado para versiones futuras

Una DSL textual dedicada podrá introducirse cuando el modelo abstracto y los
contratos de validación estén estabilizados.

## Separación de responsabilidades

La notación oficial se divide en tres contratos:

1. **Especificación abstracta**
2. **Modelo canónico**
3. **Contratos de renderizado**

Ningún renderizador puede redefinir el significado abstracto de la notación.

## Extensión PlantUML

La futura extensión en PlantUML debe introducir un **lenguaje visual
propio de Arch3**, no rectángulos genéricos.

Debe incluir:

- estereotipos, sprites, skins o macros propios de Arch3
- tratamiento visual distinto para actors, systems, containers y components
- affordances claras de expansión
- tratamiento visual específico para dependencias de librerías en capa 3
- callouts de metadatos alineados con la semántica de Arch3

## Plan de releases

### v0.1

- línea base abstracta de la notación
- modelo JSON canónico
- reglas obligatorias de identidad y relaciones
- renderer placeholder explícitamente deprecado como no final

### v0.2

- semántica de boundaries
- convenciones de metadatos más fuertes
- links de expansión entre capas
- primer borrador del contrato visual para PlantUML

### v1.0

- especificación estable
- suite de validación estable
- primera extensión oficial de PlantUML con lenguaje visual propio de Arch3
- roadmap de DSL confirmado

## Criterios de aceptación

La especificación está lista para implementación cuando:

- sintaxis y semántica están separadas y explícitas
- cada regla central tiene ejemplos válidos e inválidos
- ids, relaciones, metadatos y expansión están totalmente definidos
- el contrato del renderer depende explícitamente del modelo abstracto
- el placeholder genérico de PlantUML queda documentado como no conforme con
  la visión final de Arch3
