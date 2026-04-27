# CLI validation

Arch3 now provides an official CLI for validating files and fixture folders.

## Commands

Validate one file:

```bash
npm run arch3 -- validate examples/fixtures/valid/full.arch3.json
```

Validate a directory recursively:

```bash
npm run arch3 -- validate examples/fixtures
```

Validate only structural schema rules:

```bash
npm run arch3 -- validate examples/fixtures --schema-only
```

Validate the official fixture catalog:

```bash
npm run arch3 -- fixtures
```

Render PlantUML from a source file:

```bash
npm run arch3 -- render examples/fixtures/valid/full.arch3 --layer components --expand checkout-api
```

Regenerate official PlantUML snapshots:

```bash
npm run arch3 -- snapshots examples/fixtures/valid/full.arch3
```

Format a source file as JSON:

```bash
npm run arch3 -- format examples/fixtures/valid/full.arch3 --to json
```

Format a source file as Arch3 DSL:

```bash
npm run arch3 -- format examples/fixtures/valid/full.arch3.json --to arch3
```

Lint a file or directory with Arch3 conventions:

```bash
npm run arch3 -- lint examples/fixtures
```

Watch a directory and re-run validation continuously:

```bash
npm run arch3 -- watch examples/fixtures
```

Watch a directory and re-run lint continuously:

```bash
npm run arch3 -- watch examples/fixtures --lint
```

## Output model

The CLI prints:

- `PASS` for valid files
- `FAIL` for invalid files
- issue details with `code`, `path`, and `message`
- PlantUML text when using `render`
- committed `.puml` snapshots when using `snapshots`
- normalized JSON or Arch3 DSL when using `format`
- advisory warnings when using `lint`
- continuous feedback when using `watch`

## Recommended use

- use `validate` during local authoring
- use `fixtures` in automation and CI
- use `--schema-only` when checking canonical shape separately from semantics
