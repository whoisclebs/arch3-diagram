# Validación por CLI

Arch3 ahora ofrece un CLI oficial para validar archivos y carpetas de fixtures.

## Comandos

Validar un archivo:

```bash
npm run arch3 -- validate examples/fixtures/valid/full.arch3.json
```

Validar un directorio recursivamente:

```bash
npm run arch3 -- validate examples/fixtures
```

Validar solo reglas estructurales del schema:

```bash
npm run arch3 -- validate examples/fixtures --schema-only
```

Validar el catálogo oficial de fixtures:

```bash
npm run arch3 -- fixtures
```

Renderizar PlantUML desde un archivo fuente:

```bash
npm run arch3 -- render examples/fixtures/valid/full.arch3 --layer components --expand checkout-api
```

Regenerar snapshots oficiales de PlantUML:

```bash
npm run arch3 -- snapshots examples/fixtures/valid/full.arch3
```

Formatear un archivo fuente como JSON:

```bash
npm run arch3 -- format examples/fixtures/valid/full.arch3 --to json
```

Formatear un archivo fuente como Arch3 DSL:

```bash
npm run arch3 -- format examples/fixtures/valid/full.arch3.json --to arch3
```

Hacer lint de un archivo o directorio con convenciones Arch3:

```bash
npm run arch3 -- lint examples/fixtures
```

Observar un directorio y volver a validar continuamente:

```bash
npm run arch3 -- watch examples/fixtures
```

Observar un directorio y volver a ejecutar lint continuamente:

```bash
npm run arch3 -- watch examples/fixtures --lint
```
