# Contributing to arch3-diagram

Thank you for contributing to arch3-diagram.

## Before you start

- read the [Code of Conduct](./CODE_OF_CONDUCT.md)
- read the [Security Policy](./SECURITY.md)
- check existing issues: https://github.com/whoisclebs/arch3-diagram/issues
- open a new issue if the work is not tracked yet

## Development workflow

1. fork the repository
2. create a focused branch
3. make small, reviewable changes
4. add or update tests
5. run:

```bash
npm install
npm run typecheck
npm run test
npm run build
```

6. open a pull request with context, screenshots, and tradeoffs when relevant

## Contribution guidelines

- keep changes aligned with the Arch3 specification and notation contracts
- do not copy third-party DSLs, parsers, templates, or proprietary assets
- prefer English for code, comments, commit messages, and repository metadata
- keep documentation consistent across supported locales when updating docs
- prefer small pull requests over large, unrelated batches of work

## Pull request checklist

- [ ] the change has a clear purpose
- [ ] tests were added or updated when behavior changed
- [ ] typecheck, tests, and build pass locally
- [ ] docs were updated when the change affects users or contributors
- [ ] no secrets, credentials, or private data were added

## Need help?

Open a discussion or issue at:

https://github.com/whoisclebs/arch3-diagram
