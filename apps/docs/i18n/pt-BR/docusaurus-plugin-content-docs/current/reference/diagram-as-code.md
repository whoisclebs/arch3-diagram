# Diagram as code

Arch3 suporta atualmente JSON e uma DSL textual mínima.

## Características

- ids estáveis
- arrays explícitos por camada
- relacionamentos nomeados
- metadados arbitrários em containers e componentes
- autoria textual por meio de comandos lineares da Arch3 DSL

## Exemplo

```json
{
  "methodology": {
    "name": "Arch3",
    "layers": ["context", "containers", "components"]
  }
}
```
