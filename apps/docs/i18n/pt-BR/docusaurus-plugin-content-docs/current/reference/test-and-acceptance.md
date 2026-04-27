# Especificação de testes e aceitação v0.1

## Estado

Este documento define a estratégia de validação, os fixtures requeridos e os
critérios de aceitação para a versão v0.1 da especificação Arch3.

Ele existe para garantir que parser, validador, editor e extensões de render
possam ser implementados com TDD sobre contratos estáveis.

## Estratégia de validação

A validação deve acontecer em camadas independentes, nesta ordem:

1. **Syntax**
2. **Structure**
3. **Semantics**
4. **Visual compliance**

### 1. Validação sintática

- confirmar que a entrada é JSON válido
- rejeitar input malformado cedo
- evitar reparos silenciosos

### 2. Validação estrutural

- confirmar a forma canônica de topo
- confirmar seções obrigatórias e tipos corretos
- confirmar shapes das entidades antes da interpretação semântica

### 3. Validação semântica

- validar ids, ownership, relacionamentos, metadata e regras por camada
- confirmar que o modelo tem significado, não apenas forma

### 4. Validação de conformidade visual

- confirmar que um renderer ou extensão expressa visualmente a semântica Arch3
- impedir que saída genérica seja tratada como conformidade final

## Tipos obrigatórios de fixtures

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
- posicionamento inválido de primitivos

### Fixtures inválidos de structure

- ausência de `methodology`
- ausência de `scope`
- ausência de `context`
- ausência de `containers`
- ausência de `components`
- ausência de campos obrigatórios
- tipos inválidos

### Fixtures inválidos de semantics

- ids duplicados
- relationship target inexistente
- referência inválida de system
- referência inválida de container
- tipos inválidos de metadata
- relationship sem descrição
- elementos em papel de camada incorreto

### Fixtures visuais

- **placeholder visual fixture**
- **draft-compliant visual fixture**
- **layer-specific visual fixtures**
- **expansion visual fixtures**
- **regression snapshots**

## Matriz de validação

| Dimensão | Objetivo | O que validar | Falha esperada |
| --- | --- | --- | --- |
| Syntax | Formato válido | parsing JSON | erro de parsing |
| Structure | Forma canônica | seções obrigatórias, campos, tipos | erro estrutural |
| Semantics | Correção do modelo | ids, ownership, targets, metadata, invariantes | erro semântico |
| Visual compliance | Fidelidade Arch3 | distinção de entidades, intenção por camada, metadata, expansão | classificação não conforme |

## Critérios de prontidão para TDD

A especificação está pronta para implementação quando:

- cada regra possui pelo menos um fixture válido
- cada regra possui pelo menos um fixture inválido
- syntax, structure, semantics e visual compliance estão separados
- as categorias de erro são previsíveis e nomeadas
- a saída placeholder está marcada explicitamente como não final

## Critérios de aceitação do parser

O parser é aceitável quando:

- rejeita JSON malformado de forma determinística
- produz saída estável para entradas válidas
- não realiza reparos semânticos
- preserva a forma canônica esperada pelo validador

## Critérios de aceitação do validador

O validador é aceitável quando:

- distingue falhas estruturais e semânticas
- retorna issues estruturados com code, path e message
- aplica contratos de campos obrigatórios
- aplica unicidade global de ids
- aplica referências de ownership
- aplica validade de relationship targets
- aplica regras de tipos para metadata

## Critérios de aceitação do editor

O editor é aceitável quando:

- ajuda a escrever a fonte Arch3 diretamente
- expõe fixtures oficiais como pontos de partida de referência
- exibe com clareza feedback de syntax e validação
- ajuda a entender a notação durante a edição
- funciona como ambiente de autoria de referência, similar em espírito ao
  Swagger Editor

## Critérios de aceitação da extensão de render

Uma extensão de render Arch3 é aceitável quando:

- não redefine a semântica do Arch3
- distingue visualmente actor, system, container e component
- preserva direção e descrição de relacionamentos
- preserva rastreabilidade de metadata
- torna expansão visível e compreensível
- pode ser classificada como placeholder, draft-compliant ou fully compliant

## Critérios de regressão

Versões futuras devem preservar:

- significado estável das entidades existentes
- significado estável do ownership por camada
- significado estável da direção dos relacionamentos
- significado estável das keys de metadata já definidas

Testes de regressão devem detectar quando:

- input inválido passa a ser aceito silenciosamente
- fixtures válidos deixam de passar
- relationship targets perdem enforcement
- regras de metadata enfraquecem sem intenção
- a saída visual volta a colapsar para render genérico

## Critérios de aceitação de release v0.1

A especificação Arch3 v0.1 está pronta para implementação quando:

- official notation está documentada
- canonical model está documentado
- visual contract está documentado
- test and acceptance specification está documentado
- existe pelo menos um minimal valid fixture e um conjunto inválido para cada
  camada de validação
