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

  const lines: string[] = [
    "@startuml Arch3",
    `title ${buildTitle(validModel, focusLayer)}`,
    "skinparam shadowing false",
    "skinparam packageStyle rectangle",
    "skinparam defaultTextAlignment center",
    "",
  ];

  validModel.context.actors.forEach((actor) => {
    lines.push(`actor \"${actor.name}\" as ${aliasFor(actor.id)}`);
  });

  if (focusLayer === "context") {
    validModel.context.systems.forEach((system) => {
      lines.push(
        `rectangle \"${system.name}\\nSystem\" as ${aliasFor(system.id)} #E3F2FD`
      );
    });
  }

  if (focusLayer === "containers" || focusLayer === "components") {
    lines.push("package \"Containers\" {");
    validModel.containers.forEach((container) => {
      lines.push(
        `rectangle \"${container.name}\\n[${container.technology}]\" as ${aliasFor(container.id)} #E8F5E9`
      );

      const metadataLines = linesForMetadata(container.metadata);
      if (metadataLines.length > 0) {
        lines.push(`note right of ${aliasFor(container.id)}`);
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
        lines.push(
          `rectangle \"${component.name}\\nlibs: ${component.libraries.join(", ")}\" as ${aliasFor(component.id)} #FFF8E1`
        );
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
