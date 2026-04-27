# Diagram as code

Arch3 currently uses JSON as its first working DSL.

## Characteristics

- stable ids
- explicit arrays per layer
- named relationships
- arbitrary metadata on containers and components

## Example

```json
{
  "methodology": {
    "name": "Arch3",
    "layers": ["context", "containers", "components"]
  }
}
```
