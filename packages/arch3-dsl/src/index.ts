import {
  Arch3ValidationError,
  ARCH3_LAYERS,
  assertValidArch3Model,
  createExampleModel,
  type Arch3Component,
  type Arch3Container,
  type Arch3Model,
  type Arch3Relationship,
} from "@arch3/arch3-model";

export { Arch3ValidationError } from "@arch3/arch3-model";

export type Arch3FixtureSource = {
  id: string;
  label: string;
  source: string;
  format: "json" | "arch3";
};

export type Arch3TextAstNode =
  | { type: "methodology"; name: string; version: string; layers: string[]; line: number }
  | { type: "scope"; name: string; description: string; line: number }
  | { type: "actor"; id: string; name: string; description: string; line: number }
  | { type: "system"; id: string; name: string; description: string; line: number }
  | {
      type: "container";
      id: string;
      system: string;
      name: string;
      technology: string;
      description: string;
      metadata: Record<string, string | number | boolean>;
      line: number;
    }
  | {
      type: "component";
      id: string;
      container: string;
      name: string;
      description: string;
      libraries: string[];
      metadata: Record<string, string | number | boolean>;
      line: number;
    }
  | {
      type: "rel";
      from: string;
      target: string;
      description: string;
      line: number;
    };

export type Arch3TextAst = {
  nodes: Arch3TextAstNode[];
};

type Arch3TextState = {
  methodology?: Arch3Model["methodology"];
  scope?: Arch3Model["scope"];
  context: Arch3Model["context"];
  containers: Arch3Container[];
  components: Arch3Component[];
  pendingRelationships: Array<{ from: string; relationship: Arch3Relationship }>;
};

function normalizePrimitive(value: string): string | number | boolean {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  const asNumber = Number(value);
  if (!Number.isNaN(asNumber) && value.trim() !== "") {
    return asNumber;
  }

  return value;
}

function tokenizeArch3Line(line: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]!;

    if (character === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && /\s/.test(character)) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += character;
  }

  if (inQuotes) {
    throw new Error("Unterminated quoted string in Arch3 text DSL.");
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

function parseMetadataTokens(tokens: string[]): Record<string, string | number | boolean> {
  return tokens.reduce<Record<string, string | number | boolean>>((metadata, token) => {
    const separatorIndex = token.indexOf("=");
    if (separatorIndex <= 0) {
      throw new Error(`Invalid metadata token: ${token}`);
    }

    const key = token.slice(0, separatorIndex);
    const rawValue = token.slice(separatorIndex + 1);
    metadata[key] = normalizePrimitive(rawValue);
    return metadata;
  }, {});
}

function parseLibrariesToken(token: string | undefined): string[] {
  if (!token) {
    return [];
  }

  if (!token.startsWith("libs=")) {
    throw new Error(`Invalid libraries token: ${token}`);
  }

  const libraries = token.slice(5);
  return libraries.length === 0 ? [] : libraries.split(",").filter(Boolean);
}

function buildModelFromTextState(state: Arch3TextState): Arch3Model {
  if (!state.methodology) {
    throw new Error("Missing methodology declaration in Arch3 text DSL.");
  }

  if (!state.scope) {
    throw new Error("Missing scope declaration in Arch3 text DSL.");
  }

  const model: Arch3Model = {
    methodology: state.methodology,
    scope: state.scope,
    context: state.context,
    containers: state.containers,
    components: state.components,
  };

  const containersById = new Map(model.containers.map((container) => [container.id, container]));
  const componentsById = new Map(model.components.map((component) => [component.id, component]));

  state.pendingRelationships.forEach(({ from, relationship }) => {
    const container = containersById.get(from);
    if (container) {
      container.relationships.push(relationship);
      return;
    }

    const component = componentsById.get(from);
    if (component) {
      component.relationships.push(relationship);
      return;
    }

    throw new Error(`Relationship source not found: ${from}`);
  });

  return assertValidArch3Model(model);
}

function buildTextStateFromAst(ast: Arch3TextAst): Arch3TextState {
  const state: Arch3TextState = {
    context: {
      actors: [],
      systems: [],
    },
    containers: [],
    components: [],
    pendingRelationships: [],
  };

  ast.nodes.forEach((node) => {
    switch (node.type) {
      case "methodology":
        state.methodology = {
          name: node.name as "Arch3",
          version: node.version,
          layers: (node.layers.length > 0 ? node.layers : [...ARCH3_LAYERS]) as Arch3Model["methodology"]["layers"],
        };
        break;
      case "scope":
        state.scope = {
          name: node.name,
          description: node.description,
        };
        break;
      case "actor":
        state.context.actors.push({
          id: node.id,
          name: node.name,
          description: node.description,
        });
        break;
      case "system":
        state.context.systems.push({
          id: node.id,
          name: node.name,
          description: node.description,
        });
        break;
      case "container":
        state.containers.push({
          id: node.id,
          system: node.system,
          name: node.name,
          technology: node.technology,
          description: node.description,
          metadata: node.metadata,
          relationships: [],
        });
        break;
      case "component":
        state.components.push({
          id: node.id,
          container: node.container,
          name: node.name,
          description: node.description,
          libraries: node.libraries,
          metadata: node.metadata,
          relationships: [],
        });
        break;
      case "rel":
        state.pendingRelationships.push({
          from: node.from,
          relationship: {
            target: node.target,
            description: node.description,
          },
        });
        break;
    }
  });

  return state;
}

export function parseArch3Json(source: string): Arch3Model {
  let parsed: unknown;

  try {
    parsed = JSON.parse(source) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown parse error";
    throw new Error(`Invalid Arch3 JSON: ${message}`);
  }

  return assertValidArch3Model(parsed);
}

export function parseArch3TextAst(source: string): Arch3TextAst {
  const nodes: Arch3TextAstNode[] = [];

  source
    .split(/\r?\n/)
    .forEach((rawLine, index) => {
      const line = rawLine.trim();
      if (line.length === 0 || line.startsWith("#")) {
        return;
      }

      const tokens = tokenizeArch3Line(line);
      const [command, ...rest] = tokens;
      const lineNumber = index + 1;

      switch (command) {
        case "methodology": {
          const [name, version, ...layers] = rest;
          nodes.push({
            type: "methodology",
            name,
            version,
            layers,
            line: lineNumber,
          });
          break;
        }
        case "scope": {
          const [name, description] = rest;
          nodes.push({ type: "scope", name, description, line: lineNumber });
          break;
        }
        case "actor": {
          const [id, name, description] = rest;
          nodes.push({ type: "actor", id, name, description, line: lineNumber });
          break;
        }
        case "system": {
          const [id, name, description] = rest;
          nodes.push({ type: "system", id, name, description, line: lineNumber });
          break;
        }
        case "container": {
          const [id, system, name, technology, description, ...metadataTokens] = rest;
          nodes.push({
            type: "container",
            id,
            system,
            name,
            technology,
            description,
            metadata: parseMetadataTokens(metadataTokens),
            line: lineNumber,
          });
          break;
        }
        case "component": {
          const [id, container, name, description, librariesToken, ...metadataTokens] = rest;
          nodes.push({
            type: "component",
            id,
            container,
            name,
            description,
            libraries: parseLibrariesToken(librariesToken),
            metadata: parseMetadataTokens(metadataTokens),
            line: lineNumber,
          });
          break;
        }
        case "rel": {
          const [from, target, description] = rest;
          nodes.push({
            type: "rel",
            from,
            target,
            description,
            line: lineNumber,
          });
          break;
        }
        default:
          throw new Error(`Unknown Arch3 DSL command: ${command} at line ${lineNumber}`);
      }
    });

  return { nodes };
}

export function parseArch3Text(source: string): Arch3Model {
  return buildModelFromTextState(buildTextStateFromAst(parseArch3TextAst(source)));
}

export function parseArch3Source(source: string): Arch3Model {
  const trimmed = source.trim();
  if (trimmed.startsWith("{")) {
    return parseArch3Json(source);
  }
  return parseArch3Text(source);
}

export function stringifyArch3Json(model: Arch3Model): string {
  return `${JSON.stringify(assertValidArch3Model(model), null, 2)}\n`;
}

export function stringifyArch3Text(model: Arch3Model): string {
  const validModel = assertValidArch3Model(model);
  const lines: string[] = [];

  lines.push(
    `methodology ${validModel.methodology.name} ${validModel.methodology.version} ${validModel.methodology.layers.join(" ")}`
  );
  lines.push(`scope "${validModel.scope.name}" "${validModel.scope.description}"`);

  validModel.context.actors.forEach((actor) => {
    lines.push(`actor ${actor.id} "${actor.name}" "${actor.description}"`);
  });

  validModel.context.systems.forEach((system) => {
    lines.push(`system ${system.id} "${system.name}" "${system.description}"`);
  });

  validModel.containers.forEach((container) => {
    const metadataTokens = Object.entries(container.metadata).map(
      ([key, value]) => `${key}=${String(value)}`
    );
    lines.push(
      `container ${container.id} ${container.system} "${container.name}" "${container.technology}" "${container.description}"${metadataTokens.length > 0 ? ` ${metadataTokens.join(" ")}` : ""}`
    );
  });

  validModel.components.forEach((component) => {
    const metadataTokens = Object.entries(component.metadata).map(
      ([key, value]) => `${key}=${String(value)}`
    );
    lines.push(
      `component ${component.id} ${component.container} "${component.name}" "${component.description}" libs=${component.libraries.join(",")}${metadataTokens.length > 0 ? ` ${metadataTokens.join(" ")}` : ""}`
    );
  });

  validModel.containers.forEach((container) => {
    container.relationships.forEach((relationship) => {
      lines.push(`rel ${container.id} ${relationship.target} "${relationship.description}"`);
    });
  });

  validModel.components.forEach((component) => {
    component.relationships.forEach((relationship) => {
      lines.push(`rel ${component.id} ${relationship.target} "${relationship.description}"`);
    });
  });

  return `${lines.join("\n")}\n`;
}

export function getExampleArch3Source(): string {
  return stringifyArch3Json(createExampleModel());
}

export function getExampleArch3TextSource(): string {
  return stringifyArch3Text(createExampleModel());
}

export function getArch3FixtureSources(): Arch3FixtureSource[] {
  const full = createExampleModel();
  const contextOnly: Arch3Model = {
    ...createExampleModel(),
    scope: {
      name: "Context Scope",
      description: "Fixture focused on layer 1.",
    },
    containers: [],
    components: [],
  };
  const containersOnly: Arch3Model = {
    ...createExampleModel(),
    scope: {
      name: "Containers Scope",
      description: "Fixture focused on layer 2.",
    },
    context: {
      actors: [],
      systems: [
        {
          id: "identity-platform",
          name: "Identity Platform",
          description: "Core authentication capability.",
        },
      ],
    },
    containers: [
      {
        id: "auth-web",
        system: "identity-platform",
        name: "Auth Web",
        technology: "Next.js",
        description: "Customer login experience.",
        metadata: {
          owner: "identity-squad",
          tier: "critical",
        },
        relationships: [
          {
            target: "auth-api",
            description: "Calls authentication endpoints",
          },
        ],
      },
      {
        id: "auth-api",
        system: "identity-platform",
        name: "Auth API",
        technology: "Go",
        description: "Authentication backend.",
        metadata: {
          owner: "identity-squad",
          runtime: "service",
        },
        relationships: [],
      },
    ],
    components: [],
  };
  const componentsExpanded: Arch3Model = {
    ...createExampleModel(),
    scope: {
      name: "Components Scope",
      description: "Fixture focused on layer 3.",
    },
    context: {
      actors: [],
      systems: [
        {
          id: "orders-platform",
          name: "Orders Platform",
          description: "Order orchestration capability.",
        },
      ],
    },
    containers: [
      {
        id: "orders-api",
        system: "orders-platform",
        name: "Orders API",
        technology: "Node.js",
        description: "Order backend.",
        metadata: {
          owner: "orders-squad",
          runtime: "container",
        },
        relationships: [],
      },
    ],
    components: [
      {
        id: "orders-controller",
        container: "orders-api",
        name: "Orders Controller",
        description: "Input boundary for order requests.",
        libraries: ["express", "zod"],
        metadata: {
          owner: "orders-squad",
        },
        relationships: [
          {
            target: "orders-service",
            description: "Delegates orchestration",
          },
        ],
      },
      {
        id: "orders-service",
        container: "orders-api",
        name: "Orders Service",
        description: "Business orchestration.",
        libraries: ["prisma", "zod"],
        metadata: {
          owner: "orders-squad",
        },
        relationships: [
          {
            target: "orders-repository",
            description: "Persists aggregates",
          },
        ],
      },
      {
        id: "orders-repository",
        container: "orders-api",
        name: "Orders Repository",
        description: "Persistence adapter.",
        libraries: ["prisma"],
        metadata: {
          owner: "orders-squad",
        },
        relationships: [],
      },
    ],
  };
  const minimal: Arch3Model = {
    methodology: {
      name: "Arch3",
      version: "0.1.0",
      layers: ["context", "containers", "components"],
    },
    scope: {
      name: "Minimal Scope",
      description: "Smallest valid Arch3 model.",
    },
    context: {
      actors: [],
      systems: [],
    },
    containers: [],
    components: [],
  };

  return [
    { id: "minimal", label: "Minimal JSON", source: stringifyArch3Json(minimal), format: "json" },
    { id: "full", label: "Full JSON", source: stringifyArch3Json(full), format: "json" },
    { id: "context-only", label: "Context JSON", source: stringifyArch3Json(contextOnly), format: "json" },
    { id: "containers-only", label: "Containers JSON", source: stringifyArch3Json(containersOnly), format: "json" },
    { id: "components-expanded", label: "Components JSON", source: stringifyArch3Json(componentsExpanded), format: "json" },
    { id: "full-text", label: "Full Arch3 DSL", source: stringifyArch3Text(full), format: "arch3" },
    { id: "containers-text", label: "Containers Arch3 DSL", source: stringifyArch3Text(containersOnly), format: "arch3" },
  ];
}
