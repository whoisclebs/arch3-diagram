# Modelo canônico v0.1

## Estado

Este documento define o modelo canônico do Arch3 para a versão v0.1 da
especificação.

O modelo canônico é a **fonte de verdade** para parsers, validadores,
renderizadores, testes e futuras DSLs.

## Objetivos

O modelo canônico deve ser:

- determinístico
- amigável para máquinas
- orientado à validação
- fácil de versionar e comparar
- independente de qualquer renderizador ou motor de layout

## Formato canônico

Na v0.1, o formato canônico de autoria é JSON.

Forma de topo:

```json
{
  "methodology": {},
  "scope": {},
  "context": {},
  "containers": [],
  "components": []
}
```

## Seções de topo

### `methodology`

Obrigatória.

Campos:

- `name`: deve ser `"Arch3"`
- `version`: string de versão do modelo ou da especificação
- `layers`: lista ordenada das camadas ativas

### `scope`

Obrigatória.

Campos:

- `name`
- `description`

### `context`

Obrigatória.

Campos:

- `actors`
- `systems`

### `containers`

Array obrigatório.

### `components`

Array obrigatório.

## Contratos das entidades

### Actor

Campos obrigatórios:

- `id`
- `name`
- `description`

### System

Campos obrigatórios:

- `id`
- `name`
- `description`

### Container

Campos obrigatórios:

- `id`
- `system`
- `name`
- `technology`
- `description`
- `metadata`
- `relationships`

### Component

Campos obrigatórios:

- `id`
- `container`
- `name`
- `description`
- `libraries`
- `metadata`
- `relationships`

## Objetos compartilhados

### Relationship

Campos obrigatórios:

- `target`
- `description`

Regras:

- `target` deve referenciar um id existente
- o modelo não infere relacionamentos reversos automaticamente

### Metadata

Metadata é um objeto JSON plano.

Tipos permitidos na v0.1:

- string
- number
- boolean

Regras:

- objetos aninhados estão fora de escopo na v0.1
- arrays estão fora de escopo na v0.1
- as chaves são case-sensitive

## Invariantes de identidade

- todos os ids devem ser globalmente únicos dentro do diagrama
- os ids devem permanecer estáveis entre expansões de camada
- os ids são chaves canônicas para links e parsing futuro

## Invariantes de ownership por camada

- actors vivem apenas em `context.actors`
- systems vivem apenas em `context.systems`
- containers devem referenciar exatamente um system
- components devem referenciar exatamente um container

## Invariantes de relacionamento

- targets não resolvidos são inválidos
- a validação semântica não depende do renderer

## Regras de serialização

- chaves obrigatórias devem estar sempre presentes
- coleções vazias devem ser serializadas como arrays vazios
- metadata deve ser serializado como objeto, mesmo vazio

## Níveis de validação

### Validação sintática

Verifica se o payload é JSON válido.

### Validação estrutural

Verifica seções obrigatórias e tipos dos campos.

### Validação semântica

Verifica:

- unicidade de ids
- referências de ownership
- targets de relacionamentos
- tipos permitidos de metadata
- presença dos campos obrigatórios

## Exemplo mínimo válido

```json
{
  "methodology": {
    "name": "Arch3",
    "version": "0.1.0",
    "layers": ["context", "containers", "components"]
  },
  "scope": {
    "name": "Example Scope",
    "description": "Minimal valid Arch3 model."
  },
  "context": {
    "actors": [],
    "systems": []
  },
  "containers": [],
  "components": []
}
```

## Fora de escopo na v0.1

- coordenadas explícitas de layout
- declarações de estilo visual dentro do modelo
- boundaries aninhados com semântica completa
- schemas polimórficos de metadata
- múltiplos formatos canônicos de autoria

## Critérios de aceitação

O modelo canônico está pronto para implementação quando:

- cada entidade tem contrato de campos obrigatórios
- todas as invariantes compartilhadas estão explícitas
- a validação pode ser implementada sem assumir renderer
- existe pelo menos um fixture mínimo válido e um conjunto de inválidos
- renderizadores futuros podem consumir o modelo sem mudar sua semântica
