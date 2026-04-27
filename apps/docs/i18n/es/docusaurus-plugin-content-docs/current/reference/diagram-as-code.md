# Diagram as code

Arch3 soporta actualmente JSON y una DSL textual mínima.

## Características

- ids estables
- arrays explícitos por capa
- relaciones con nombre
- metadatos arbitrarios en contenedores y componentes
- autoría textual mediante comandos lineales de Arch3 DSL

## Ejemplo

```json
{
  "methodology": {
    "name": "Arch3",
    "layers": ["context", "containers", "components"]
  }
}
```
