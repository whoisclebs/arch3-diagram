# Diagram as code

Arch3 usa atualmente JSON como sua primeira DSL funcional.

## Características

- ids estáveis
- arrays explícitos por camada
- relacionamentos nomeados
- metadados arbitrários em containers e componentes

## Exemplo

```json
{
  "methodology": {
    "name": "Arch3",
    "layers": ["context", "containers", "components"]
  }
}
```
