# Notação oficial do Arch3

## Estado

Este documento define a linha de base oficial da notação Arch3.

A saída atual em PlantUML genérico é tratada explicitamente como um
**placeholder descartável**. Ela **não** conta como a linguagem visual final do
Arch3.

## Propósito

Arch3 é uma notação para modelagem arquitetural AI-first. Ela foi projetada
para ser:

- legível por humanos
- escrevível por humanos e agentes
- parseável sem ambiguidade
- evolutiva entre múltiplos renderizadores

Arch3 é inspirada no C4 Model, mas é especificada como uma notação própria.
Ela não depende de um renderer único.

## Princípios centrais

- design guiado por especificação e independente de implementação
- modelo abstrato independente de renderizador
- expansão progressiva de visão geral para detalhe
- identificadores estáveis e semântica determinística
- metadados como contexto arquitetural de primeira classe

## Não objetivos

- compatibilidade total com sintaxes de C4, UML ou Structurizr
- reutilização direta de semântica visual de terceiros
- tratar retângulos genéricos de PlantUML como sistema visual final

## Camadas

### Camada 1: Contexto

Mostra atores, sistemas e fronteiras de negócio.

Regras:

- não deve expor detalhes tecnológicos de baixo nível
- deve focar em fluxo de valor e fronteiras do sistema

### Camada 2: Containers

Mostra unidades de runtime ou deploy dentro de um sistema.

Regras:

- containers devem declarar tecnologia
- relacionamentos devem descrever intenção e protocolo quando fizer sentido
- metadados são obrigatórios para uso orientado à governança

### Camada 3: Componentes

Mostra as partes lógicas internas de um container.

Regras:

- componentes pertencem a exatamente um container
- dependências de bibliotecas podem ser mostradas aqui
- só deve haver expansão quando o detalhe adicional for útil

## Entidades centrais

### Actor

- humano externo ou sistema externo
- identidade obrigatória

### System

- capacidade de negócio ou plataforma de alto nível
- pode conter containers

### Container

- unidade de runtime ou deploy
- pode conter componentes
- deve suportar metadados

### Component

- módulo interno dentro de um container
- pode declarar dependências de bibliotecas

### Boundary

- agrupamento lógico ou escopo visual
- opcional na v0.1, com evolução prevista nas próximas versões

## Regras de identidade

- todo elemento deve ter um `id` estável
- ids devem ser únicos dentro do diagrama
- ids são referências semânticas, não labels de apresentação
- labels podem mudar sem mudar ids

## Regras de relacionamento

- relacionamentos são direcionais por padrão
- cada relacionamento deve incluir descrição legível por humanos
- targets devem referenciar ids existentes
- decoração específica do renderizador não pode mudar o significado

## Regras de metadados

Metadados fazem parte do contrato da notação.

No mínimo, containers devem suportar campos como:

- `owner`
- `repo`
- `tier`
- `runtime`

Regras:

- chaves devem ser strings determinísticas
- valores devem ser primitivos serializáveis
- renderizadores podem ocultá-los visualmente, mas não perdê-los
  semanticamente

## Regras de expansão

Arch3 suporta drill-down explícito.

- systems podem expandir para containers
- containers podem expandir para components
- a expansão deve preservar continuidade de identidade entre camadas
- a expansão é semântica, não apenas zoom ou layout

## Modos de autoria

### Modo canônico na v0.1

JSON é o formato canônico de autoria para a v0.1.

### Modo planejado para versões futuras

Uma DSL textual dedicada poderá ser introduzida quando o modelo abstrato e os
contratos de validação estiverem estabilizados.

## Separação de responsabilidades

A notação oficial é dividida em três contratos:

1. **Especificação abstrata**
2. **Modelo canônico**
3. **Contratos de renderização**

Nenhum renderizador pode redefinir o significado abstrato da notação.

## Extensão PlantUML

A futura extensão em PlantUML deve introduzir uma **linguagem visual
própria do Arch3**, não retângulos genéricos.

Ela deve incluir:

- estereótipos, sprites, skins ou macros próprios do Arch3
- tratamento visual distinto para actors, systems, containers e components
- affordances claras de expansão
- tratamento visual específico para dependências de bibliotecas na camada 3
- callouts de metadados alinhados com a semântica do Arch3

## Plano de releases

### v0.1

- linha de base abstrata da notação
- modelo JSON canônico
- regras obrigatórias de identidade e relacionamentos
- renderer placeholder explicitamente depreciado como não final

### v0.2

- semântica de boundaries
- convenções mais fortes de metadados
- links de expansão entre camadas
- primeiro rascunho do contrato visual para PlantUML

### v1.0

- especificação estável
- suíte de validação estável
- primeira extensão oficial de PlantUML com linguagem visual própria do Arch3
- roadmap da DSL confirmado

## Critérios de aceitação

A especificação está pronta para implementação quando:

- sintaxe e semântica estão separadas e explícitas
- cada regra central tem exemplos válidos e inválidos
- ids, relacionamentos, metadados e expansão estão totalmente definidos
- o contrato do renderer depende explicitamente do modelo abstrato
- o placeholder genérico de PlantUML fica documentado como não conforme com a
  visão final do Arch3
