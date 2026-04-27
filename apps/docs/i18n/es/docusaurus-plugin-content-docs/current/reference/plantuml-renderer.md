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
