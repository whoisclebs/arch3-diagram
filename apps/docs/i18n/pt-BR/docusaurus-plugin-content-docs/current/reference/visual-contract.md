# Contrato visual v0.1

## Estado

Este documento define o contrato visual futuro para os renderizadores Arch3.

Ele não descreve a saída atual do placeholder genérico em PlantUML. Essa saída
é intencionalmente considerada não conforme com o sistema visual final do
Arch3.

## Propósito

O contrato visual garante que os renderizadores expressem a semântica do Arch3
 por meio de uma linguagem visual própria, e não por primitivas genéricas.

## Obrigações do renderizador

Qualquer renderizador que declare compatibilidade com Arch3 deve:

- preservar o significado do modelo canônico
- renderizar as três camadas com intenção visual distinta
- manter identidade estável entre visões expandidas
- dar tratamento visual de primeira classe a metadados e relacionamentos
- evitar colapsar a semântica do Arch3 em retângulos indiferenciados

## Primitivas visuais

### Actor

- participante externo
- distinguível de systems e containers

### System

- capacidade de negócio ou plataforma de alto nível
- peso semântico maior que containers

### Container

- unidade de runtime ou deploy
- deve mostrar tecnologia e suportar metadata

### Component

- unidade lógica interna de um container
- deve poder mostrar dependências de bibliotecas

### Boundary

- agrupamento lógico ou marcador de escopo
- secundário diante dos nós principais

## Expectativas por camada

### Camada 1: Contexto

- legibilidade de negócio é prioritária
- systems e actors devem dominar a cena

### Camada 2: Containers

- a forma do container e o sinal de tecnologia devem ser claros
- metadata deve estar disponível sem saturar o diagrama

### Camada 3: Componentes

- os limites de componentes devem ser legíveis
- dependências de bibliotecas devem parecer diferentes de relacionamentos de
  runtime
- deve ficar claro qual container foi expandido

## Tratamento de metadata

Metadata é semanticamente importante.

Capacidades obrigatórias:

- mecanismo visual para metadata operacional chave
- associação correta entre metadata e node
- possibilidade de compactar metadata sem perder rastreabilidade

## Tratamento de relacionamentos

Relacionamentos devem preservar visualmente:

- direção
- descrição
- identidade do target

Regras:

- relacionamentos de runtime e dependências de bibliotecas não devem parecer
  iguais
- labels devem ser legíveis sem dominar o diagrama

## Tratamento de expansão

A expansão faz parte do contrato visual.

Resultados obrigatórios:

- deve ser óbvio quando um system expande para containers
- deve ser óbvio quando um container expande para components
- o pai expandido deve continuar identificável

## Direção específica para PlantUML

A primeira extensão oficial de PlantUML deve introduzir blocos visuais próprios
do Arch3, como:

- estereótipos personalizados
- macros do Arch3
- skin parameters do Arch3
- sprites ou ícones do Arch3 quando necessário

Ele não deve depender apenas da saída genérica do PlantUML como identidade
visual final.

## Níveis de conformidade

### Placeholder

- extensão funcional tecnicamente
- saída genérica
- não conforme com o contrato visual final

### Conformidade draft

- a extensão introduz semântica visual específica do Arch3
- alguns detalhes ainda podem evoluir

### Conformidade total

- a extensão satisfaz o contrato visual completo para as camadas suportadas

## Critérios de aceitação

O contrato visual está pronto para implementação quando:

- cada entidade tem um papel visual distinto
- cada camada tem objetivos explícitos de renderização
- metadata e relacionamentos têm regras definidas
- o comportamento de expansão está especificado visualmente
- é possível julgar a extensão sem subjetividade excessiva
