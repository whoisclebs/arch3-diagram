# Text DSL v0.1

O Arch3 agora inclui uma primeira DSL textual além de JSON.

## Objetivos

- oferecer um formato de autoria humano
- continuar fácil de parsear de forma determinística
- mapear diretamente para o modelo canônico

## Sintaxe atual

Os comandos são orientados a linhas.

```text
methodology Arch3 0.1.0 context containers components
scope "Commerce Suite" "Full reference fixture for Arch3 v0.1."
actor shopper "Shopper" "Customer who places orders."
system commerce-suite "Commerce Suite" "Primary commerce platform."
container web-app commerce-suite "Web App" "React" "Customer-facing purchase experience." owner=experience-squad tier=critical
component checkout-page web-app "Checkout Page" "Checkout form and cart orchestration." libs=react-router,zustand,zod criticalFlow=true
rel web-app checkout-api "Sends checkout requests"
```

## Suporte a AST

O parser da DSL agora expõe uma AST explícita antes de convertê-la para o
modelo canônico.

## Suporte no editor

O editor de referência agora oferece:

- modo de linguagem Arch3 DSL
- syntax highlighting para comandos, strings, metadata e libraries
- completion básico de comandos
- validação em tempo real durante a edição
