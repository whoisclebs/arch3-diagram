# JSON Schema v0.1

## Estado

Arch3 v0.1 ahora incluye un JSON Schema oficial para el modelo canónico.

El schema existe para soportar:

- validación estructural
- interoperabilidad de tooling
- feedback del editor
- pruebas automáticas de contrato

## Alcance

El schema valida la forma canónica de:

- `methodology`
- `scope`
- `context`
- `containers`
- `components`

## Ubicación

Fuente principal:

```text
packages/arch3-model/src/schema/arch3.schema.json
```

Export del paquete:

```text
@whoisclebs/arch3-model/schema
```

## Capas de validación

JSON Schema cubre la **validación estructural**.

No reemplaza la validación semántica para:

- ids duplicados
- referencias de system inválidas
- referencias de container inválidas
- relationship targets inválidos
