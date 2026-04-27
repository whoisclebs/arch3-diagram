# Security Policy

## Supported versions

Security fixes are applied on a best-effort basis to the latest main branch and
to the most recent tagged release.

| Version | Supported |
| ------- | --------- |
| main    | yes       |
| 0.x     | yes       |

## Reporting a vulnerability

Please do not report security vulnerabilities through public GitHub issues,
discussions, or pull requests.

Use GitHub Security Advisories for private disclosure:

https://github.com/whoisclebs/arch3-diagram/security/advisories/new

If GitHub private reporting is unavailable, contact the maintainers through the
security policy page and avoid public disclosure until triage begins.

## What to include

Please include as much of the following information as possible:

- vulnerability type and impact
- affected file paths, packages, or endpoints
- affected commit, tag, or branch
- step-by-step reproduction instructions
- proof of concept, if safely shareable
- suggested mitigation or fix, if known

## Response expectations

We aim to:

- acknowledge new reports within 5 business days
- validate severity and scope as quickly as possible
- coordinate a fix before public disclosure when appropriate

## Scope notes

This repository currently contains a web editor, documentation site, model
packages, and rendering packages. Security concerns may include, but are not
limited to:

- malicious input handling in the editor or parser
- unsafe rendering or injection paths
- dependency vulnerabilities
- supply-chain risks in build and release workflows
