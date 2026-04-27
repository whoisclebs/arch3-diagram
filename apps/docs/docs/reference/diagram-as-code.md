# Diagram as code

Arch3 currently supports both JSON and a minimal text DSL.

## Characteristics

- stable ids
- explicit arrays per layer
- named relationships
- arbitrary metadata on containers and components
- text authoring through line-based Arch3 DSL commands

## Example

```json
{
  "methodology": {
    "name": "Arch3",
    "layers": ["context", "containers", "components"]
  }
}
```
