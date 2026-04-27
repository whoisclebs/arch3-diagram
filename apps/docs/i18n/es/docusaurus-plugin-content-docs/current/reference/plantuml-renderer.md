# Extensión PlantUML

El paquete `@arch3/arch3-plantuml` es una extensión de PlantUML para Arch3.

Arch3 es independiente de PlantUML. Este paquete es solo uno de los posibles
destinos de render de la notación.

## Restricciones de diseño

- sin dependencia de C4-PlantUML
- aliases determinísticos
- render orientado por capa
- expansión opcional de contenedor a componentes
- sin redefinir la semántica de Arch3 dentro del renderer

## Estado actual de implementación

La extensión actual avanza desde **placeholder** hacia **draft-compliant**.

Ya introduce:

- macros propias de Arch3 en PlantUML
- estereotipos y skin parameters específicos de Arch3
- tratamiento distinto para actors, systems, containers, components y libraries
- tratamiento visual separado para dependencias de librerías en layer 3

## Snapshots de regresión

La extensión está respaldada por snapshots `.puml` versionados para fixtures
clave.
