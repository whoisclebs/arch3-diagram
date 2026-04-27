# Metodología Arch3

Arch3 es la metodología de diagramación publicada por arch3-diagram.

Está inspirada en el C4 Model, pero define su propia notación, modelo y
contratos de renderer.

Arch3 es independiente de PlantUML. PlantUML aparece solo como una extensión
de render.

## Objetivo

Ofrecer un enfoque pragmático y AI-first con solo tres capas:

1. contexto
2. contenedores
3. componentes

## Principios

- diagram as code versionable
- metadatos ricos en contenedores
- expansión drill-down de contenedores a componentes
- visibilidad de dependencias de librerías a nivel de componente
- un esquema diseñado para humanos y LLMs
