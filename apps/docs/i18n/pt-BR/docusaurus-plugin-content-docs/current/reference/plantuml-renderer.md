# Extensão PlantUML

O pacote `@whoisclebs/arch3-plantuml` é uma extensão de PlantUML para o Arch3.

Arch3 é independente de PlantUML. Este pacote é apenas um dos possíveis
destinos de renderização da notação.

## Restrições de design

- sem dependência de C4-PlantUML
- aliases determinísticos
- renderização orientada por camada
- expansão opcional de container para componentes
- sem redefinir a semântica do Arch3 dentro do renderer

## Estado atual da implementação

A extensão atual está avançando de **placeholder** para **draft-compliant**.

Ela já introduz:

- macros próprias do Arch3 em PlantUML
- estereótipos e skin parameters específicos do Arch3
- tratamento distinto para actors, systems, containers, components e libraries
- tratamento visual separado para dependências de bibliotecas na layer 3

## Snapshots de regressão

A extensão é sustentada por snapshots `.puml` versionados para fixtures chave.
