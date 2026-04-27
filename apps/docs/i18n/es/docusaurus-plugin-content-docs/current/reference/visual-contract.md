# Contrato visual v0.1

## Estado

Este documento define el contrato visual futuro para los renderizadores Arch3.

No describe la salida actual del placeholder genérico en PlantUML. Esa salida
se considera intencionalmente no conforme con el sistema visual final de Arch3.

## Propósito

El contrato visual garantiza que los renderizadores expresen la semántica de
Arch3 mediante un lenguaje visual propio y no mediante primitivas genéricas.

## Obligaciones del renderizador

Cualquier renderizador que declare compatibilidad con Arch3 debe:

- preservar el significado del modelo canónico
- renderizar las tres capas con intención visual distinta
- mantener identidad estable entre vistas expandidas
- dar tratamiento visual de primera clase a metadatos y relaciones
- evitar colapsar la semántica de Arch3 en rectángulos indiferenciados

## Primitivas visuales

### Actor

- participante externo
- distinguible de systems y containers

### System

- capacidad de negocio o plataforma de alto nivel
- peso semántico mayor que containers

### Container

- unidad de runtime o despliegue
- debe mostrar tecnología y soportar metadata

### Component

- unidad lógica interna de un container
- debe poder mostrar dependencias de librerías

### Boundary

- agrupación lógica o marcador de alcance
- secundario frente a nodes principales

## Expectativas por capa

### Capa 1: Contexto

- la legibilidad de negocio es prioritaria
- systems y actors deben dominar la escena

### Capa 2: Contenedores

- la forma del container y la señal tecnológica deben ser claras
- metadata debe estar disponible sin saturar el diagrama

### Capa 3: Componentes

- los límites de componentes deben ser legibles
- las dependencias de librerías deben verse distintas a relaciones de runtime
- debe quedar claro qué container fue expandido

## Tratamiento de metadata

Metadata es semánticamente importante.

Capacidades obligatorias:

- mecanismo visual para metadata operacional clave
- asociación correcta entre metadata y node
- posibilidad de compactar metadata sin perder trazabilidad

## Tratamiento de relaciones

Las relaciones deben preservar visualmente:

- dirección
- descripción
- identidad del target

Reglas:

- relaciones de runtime y dependencias de librerías no deben verse iguales
- los labels deben ser legibles sin dominar el diagrama

## Tratamiento de expansión

La expansión forma parte del contrato visual.

Resultados requeridos:

- debe ser obvio cuando un system se expande a containers
- debe ser obvio cuando un container se expande a components
- el padre expandido debe seguir identificable

## Dirección específica para PlantUML

La primera extensión oficial de PlantUML debe introducir bloques visuales propios
de Arch3, como:

- estereotipos personalizados
- macros de Arch3
- skin parameters de Arch3
- sprites o íconos de Arch3 cuando sean necesarios

No debe depender únicamente de salida genérica de PlantUML como identidad
visual final.

## Niveles de cumplimiento

### Placeholder

- extensión funcional técnicamente
- salida genérica
- no conforme con el contrato visual final

### Cumplimiento draft

- la extensión introduce semántica visual específica de Arch3
- algunos detalles aún pueden evolucionar

### Cumplimiento total

- la extensión satisface el contrato visual completo para las capas soportadas

## Criterios de aceptación

El contrato visual está listo para implementación cuando:

- cada entidad tiene un rol visual distinto
- cada capa tiene objetivos explícitos de render
- metadata y relaciones tienen reglas definidas
- la expansión está especificada visualmente
- se puede juzgar la extensión sin subjetividad excesiva
