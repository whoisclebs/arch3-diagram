# Metodologia Arch3

Arch3 é a metodologia de diagramação publicada pelo arch3-diagram.

Ela é inspirada no C4 Model, mas define sua própria notação, modelo e
contratos de renderer.

Arch3 é independente de PlantUML. PlantUML entra apenas como uma extensão de
renderização.

## Objetivo

Oferecer uma abordagem pragmática e AI-first com apenas três camadas:

1. contexto
2. containers
3. componentes

## Princípios

- diagram as code versionável
- metadados ricos em containers
- expansão drill-down de containers para componentes
- visibilidade de dependências de bibliotecas no nível de componente
- um schema projetado para humanos e LLMs
