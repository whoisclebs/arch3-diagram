# Validação por CLI

O Arch3 agora oferece um CLI oficial para validar arquivos e pastas de
fixtures.

## Comandos

Validar um arquivo:

```bash
npm run arch3 -- validate examples/fixtures/valid/full.arch3.json
```

Validar um diretório recursivamente:

```bash
npm run arch3 -- validate examples/fixtures
```

Validar apenas regras estruturais do schema:

```bash
npm run arch3 -- validate examples/fixtures --schema-only
```

Validar o catálogo oficial de fixtures:

```bash
npm run arch3 -- fixtures
```

Renderizar PlantUML a partir de um arquivo fonte:

```bash
npm run arch3 -- render examples/fixtures/valid/full.arch3 --layer components --expand checkout-api
```

Regenerar snapshots oficiais de PlantUML:

```bash
npm run arch3 -- snapshots examples/fixtures/valid/full.arch3
```

Formatar um arquivo fonte como JSON:

```bash
npm run arch3 -- format examples/fixtures/valid/full.arch3 --to json
```

Formatar um arquivo fonte como Arch3 DSL:

```bash
npm run arch3 -- format examples/fixtures/valid/full.arch3.json --to arch3
```

Executar lint em um arquivo ou diretório com convenções do Arch3:

```bash
npm run arch3 -- lint examples/fixtures
```

Observar um diretório e reexecutar validação continuamente:

```bash
npm run arch3 -- watch examples/fixtures
```

Observar um diretório e reexecutar lint continuamente:

```bash
npm run arch3 -- watch examples/fixtures --lint
```

Inspecionar a AST de um arquivo Arch3 DSL:

```bash
npm run arch3 -- ast examples/fixtures/valid/full.arch3
```

Criar uma nota de release com Changesets:

```bash
npm run changeset
```
