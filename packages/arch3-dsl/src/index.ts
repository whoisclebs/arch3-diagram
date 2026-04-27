import {
  Arch3ValidationError,
  assertValidArch3Model,
  createExampleModel,
  type Arch3Model,
} from "@arch3/arch3-model";

export { Arch3ValidationError } from "@arch3/arch3-model";

export type Arch3FixtureSource = {
  id: string;
  label: string;
  source: string;
};

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

export function stringifyArch3Json(model: Arch3Model): string {
  return `${JSON.stringify(assertValidArch3Model(model), null, 2)}\n`;
}

export function getExampleArch3Source(): string {
  return stringifyArch3Json(createExampleModel());
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
    { id: "minimal", label: "Minimal", source: stringifyArch3Json(minimal) },
    { id: "full", label: "Full", source: stringifyArch3Json(full) },
    {
      id: "context-only",
      label: "Context only",
      source: stringifyArch3Json(contextOnly),
    },
    {
      id: "containers-only",
      label: "Containers only",
      source: stringifyArch3Json(containersOnly),
    },
    {
      id: "components-expanded",
      label: "Components expanded",
      source: stringifyArch3Json(componentsExpanded),
    },
  ];
}
