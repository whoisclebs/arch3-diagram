import {
  assertValidArch3Model,
  type Arch3Container,
  type Arch3Metadata,
  type Arch3Model,
} from "@arch3/arch3-model";

export type RenderOptions = {
  focusLayer?: "context" | "containers" | "components";
  expandedContainer?: string;
};

function aliasFor(id: string): string {
  return id.replace(/[^a-zA-Z0-9]+/g, "_");
}

function linesForMetadata(metadata: Arch3Metadata = {}): string[] {
  return Object.entries(metadata).map(([key, value]) => `${key}: ${String(value)}`);
}

function buildTitle(model: Arch3Model, focusLayer: string): string {
  return `${model.scope.name} - ${focusLayer}`;
}

function renderPrelude(model: Arch3Model, focusLayer: string): string[] {
  return [
    "@startuml Arch3",
    `title ${buildTitle(model, focusLayer)}`,
    "skinparam shadowing false",
    "skinparam packageStyle rectangle",
    "skinparam defaultTextAlignment center",
    "skinparam linetype ortho",
    "hide stereotype",
    "",
    "!define ARCH3_ACTOR(name, alias) actor \"name\" as alias <<arch3_actor>>",
    "!define ARCH3_SYSTEM(name, alias) rectangle \"name\\nSystem\" as alias <<arch3_system>>",
    "!define ARCH3_CONTAINER(name, tech, alias) rectangle \"name\\n[tech]\" as alias <<arch3_container>>",
    "!define ARCH3_COMPONENT(name, alias) rectangle \"name\" as alias <<arch3_component>>",
    "!define ARCH3_LIBRARY(name, alias) artifact \"name\" as alias <<arch3_library>>",
    "",
    "skinparam actor<<arch3_actor>> { BackgroundColor #EDE9FE; BorderColor #5B21B6 }",
    "skinparam rectangle<<arch3_system>> { BackgroundColor #DBEAFE; BorderColor #1D4ED8 }",
    "skinparam rectangle<<arch3_container>> { BackgroundColor #DCFCE7; BorderColor #15803D }",
    "skinparam rectangle<<arch3_component>> { BackgroundColor #FEF3C7; BorderColor #B45309 }",
    "skinparam artifact<<arch3_library>> { BackgroundColor #FCE7F3; BorderColor #BE185D }",
    "",
  ];
}

function resolveExpandedContainer(
  model: Arch3Model,
  expandedContainer?: string
): Arch3Container {
  const containerId = expandedContainer ?? model.components[0]?.container;
  const scopedContainer = model.containers.find(
    (container) => container.id === containerId
  );

  if (!scopedContainer) {
    throw new Error(`Cannot expand unknown container: ${containerId}`);
  }

  return scopedContainer;
}

export function renderPlantUml(
  model: Arch3Model,
  options: RenderOptions = {}
): string {
  const { focusLayer = "containers", expandedContainer } = options;
  const validModel = assertValidArch3Model(model);
  const visibleComponentIds = new Set<string>();
  const visibleLibraries = new Set<string>();

  const lines: string[] = renderPrelude(validModel, focusLayer);

  validModel.context.actors.forEach((actor) => {
    lines.push(`ARCH3_ACTOR(${JSON.stringify(actor.name)}, ${aliasFor(actor.id)})`);
  });

  if (focusLayer === "context") {
    validModel.context.systems.forEach((system) => {
      lines.push(`ARCH3_SYSTEM(${JSON.stringify(system.name)}, ${aliasFor(system.id)})`);
    });
  }

  if (focusLayer === "containers" || focusLayer === "components") {
    lines.push("package \"Containers\" {");
    validModel.containers.forEach((container) => {
      lines.push(`ARCH3_CONTAINER(${JSON.stringify(container.name)}, ${JSON.stringify(container.technology)}, ${aliasFor(container.id)})`);

      const metadataLines = linesForMetadata(container.metadata);
      if (metadataLines.length > 0) {
        lines.push(`note right of ${aliasFor(container.id)}`);
        lines.push("metadata");
        metadataLines.forEach((line) => lines.push(line));
        lines.push("end note");
      }
    });
    lines.push("}");
  }

  if (focusLayer === "components") {
    const scopedContainer = resolveExpandedContainer(validModel, expandedContainer);

    lines.push("");
    lines.push(`frame \"Expanded container: ${scopedContainer.name}\" {`);
    validModel.components
      .filter((component) => component.container === scopedContainer.id)
      .forEach((component) => {
        visibleComponentIds.add(component.id);
        lines.push(`ARCH3_COMPONENT(${JSON.stringify(component.name)}, ${aliasFor(component.id)})`);

        component.libraries.forEach((library) => {
          const libraryAlias = aliasFor(`${component.id}__lib__${library}`);
          if (!visibleLibraries.has(libraryAlias)) {
            visibleLibraries.add(libraryAlias);
            lines.push(`ARCH3_LIBRARY(${JSON.stringify(library)}, ${libraryAlias})`);
          }
          lines.push(`${aliasFor(component.id)} ..> ${libraryAlias} : uses lib`);
        });
      });
    lines.push("}");
  }

  [...validModel.containers, ...validModel.components].forEach((source) => {
    (source.relationships ?? []).forEach((relationship) => {
      const isComponentSource = validModel.components.some(
        (component) => component.id === source.id
      );

      if (focusLayer !== "components" && isComponentSource) {
        return;
      }

      if (focusLayer === "components") {
        if (!visibleComponentIds.has(source.id)) {
          return;
        }

        if (!visibleComponentIds.has(relationship.target)) {
          return;
        }
      }

      lines.push(
        `${aliasFor(source.id)} --> ${aliasFor(relationship.target)} : ${relationship.description}`
      );
    });
  });

  lines.push("@enduml");

  return lines.join("\n");
}
