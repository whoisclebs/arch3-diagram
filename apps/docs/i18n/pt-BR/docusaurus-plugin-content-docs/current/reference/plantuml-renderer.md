# Extensão PlantUML

O pacote `@arch3/arch3-plantuml` é uma extensão de PlantUML para o Arch3.

Arch3 é independente de PlantUML. Este pacote é apenas um dos possíveis
destinos de renderização da notação.

## Restrições de design

- sem dependência de C4-PlantUML
- aliases determinísticos
- renderização orientada por camada
- expansão opcional de container para componentes
- sem redefinir a semântica do Arch3 dentro do renderer
