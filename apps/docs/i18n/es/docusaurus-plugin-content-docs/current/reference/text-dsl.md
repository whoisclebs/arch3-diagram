# Text DSL v0.1

Arch3 ahora incluye una primera DSL textual además de JSON.

## Objetivos

- ofrecer un formato de autoría humano
- seguir siendo fácil de parsear de forma determinística
- mapear directamente al modelo canónico

## Sintaxis actual

Los comandos son orientados a líneas.

```text
methodology Arch3 0.1.0 context containers components
scope "Commerce Suite" "Full reference fixture for Arch3 v0.1."
actor shopper "Shopper" "Customer who places orders."
system commerce-suite "Commerce Suite" "Primary commerce platform."
container web-app commerce-suite "Web App" "React" "Customer-facing purchase experience." owner=experience-squad tier=critical
component checkout-page web-app "Checkout Page" "Checkout form and cart orchestration." libs=react-router,zustand,zod criticalFlow=true
rel web-app checkout-api "Sends checkout requests"
```

## Soporte de AST

El parser de la DSL ahora expone un AST explícito antes de convertirlo al
modelo canónico.
