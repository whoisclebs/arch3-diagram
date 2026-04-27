# Diagram as code

Arch3 usa actualmente JSON como su primera DSL funcional.

## Características

- ids estables
- arrays explícitos por capa
- relaciones con nombre
- metadatos arbitrarios en contenedores y componentes

## Ejemplo

```json
{
  "methodology": {
    "name": "Arch3",
    "layers": ["context", "containers", "components"]
  }
}
```
