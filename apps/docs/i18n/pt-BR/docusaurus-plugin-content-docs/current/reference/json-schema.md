# JSON Schema v0.1

## Estado

Arch3 v0.1 agora inclui um JSON Schema oficial para o modelo canônico.

O schema existe para suportar:

- validação estrutural
- interoperabilidade de tooling
- feedback do editor
- testes automatizados de contrato

## Escopo

O schema valida a forma canônica de:

- `methodology`
- `scope`
- `context`
- `containers`
- `components`

## Localização

Fonte principal:

```text
packages/arch3-model/src/schema/arch3.schema.json
```

Export do pacote:

```text
@arch3/arch3-model/schema
```

## Camadas de validação

JSON Schema cobre a **validação estrutural**.

Ele não substitui a validação semântica para:

- ids duplicados
- referências inválidas de system
- referências inválidas de container
- relationship targets inválidos
