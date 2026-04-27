export const ARCH3_LAYERS = ["context", "containers", "components"] as const;

export type Arch3Layer = (typeof ARCH3_LAYERS)[number];

export type Arch3Relationship = {
  target: string;
  description: string;
};

export type Arch3Metadata = Record<string, string | number | boolean>;

export type Arch3Actor = {
  id: string;
  name: string;
  description: string;
};

export type Arch3System = {
  id: string;
  name: string;
  description: string;
};

export type Arch3Container = {
  id: string;
  system: string;
  name: string;
  technology: string;
  description: string;
  metadata: Arch3Metadata;
  relationships: Arch3Relationship[];
};

export type Arch3Component = {
  id: string;
  container: string;
  name: string;
  description: string;
  libraries: string[];
  metadata: Arch3Metadata;
  relationships: Arch3Relationship[];
};

export type Arch3Model = {
  methodology: {
    name: "Arch3";
    version: string;
    layers: Arch3Layer[];
  };
  scope: {
    name: string;
    description: string;
  };
  context: {
    actors: Arch3Actor[];
    systems: Arch3System[];
  };
  containers: Arch3Container[];
  components: Arch3Component[];
};

export type Arch3ValidationResult = {
  ok: boolean;
  errors: string[];
};

export function createExampleModel(): Arch3Model {
  return {
    methodology: {
      name: "Arch3",
      version: "0.1.0",
      layers: [...ARCH3_LAYERS],
    },
    scope: {
      name: "Commerce Suite",
      description: "Canonical Arch3 scope example.",
    },
    context: {
      actors: [
        {
          id: "shopper",
          name: "Shopper",
          description: "Customer who places orders.",
        },
      ],
      systems: [
        {
          id: "commerce-suite",
          name: "Commerce Suite",
          description: "Primary commerce platform.",
        },
      ],
    },
    containers: [
      {
        id: "web-app",
        system: "commerce-suite",
        name: "Web App",
        technology: "React",
        description: "Customer-facing purchase experience.",
        metadata: {
          owner: "experience-squad",
          repo: "github.com/whoisclebs/arch3-diagram",
          tier: "critical",
        },
        relationships: [
          {
            target: "checkout-api",
            description: "Sends checkout requests",
          },
        ],
      },
      {
        id: "checkout-api",
        system: "commerce-suite",
        name: "Checkout API",
        technology: "Node.js",
        description: "Processes checkout and order workflows.",
        metadata: {
          owner: "payments-squad",
          repo: "github.com/whoisclebs/arch3-diagram",
          runtime: "container",
        },
        relationships: [
          {
            target: "orders-db",
            description: "Persists orders",
          },
        ],
      },
      {
        id: "orders-db",
        system: "commerce-suite",
        name: "Orders DB",
        technology: "PostgreSQL",
        description: "Transactional order database.",
        metadata: {
          owner: "data-platform",
          backup: "enabled",
        },
        relationships: [],
      },
    ],
    components: [
      {
        id: "checkout-page",
        container: "web-app",
        name: "Checkout Page",
        description: "Checkout form and cart orchestration.",
        libraries: ["react-router", "zustand", "zod"],
        metadata: {
          criticalFlow: true,
        },
        relationships: [
          {
            target: "checkout-client",
            description: "Triggers HTTP requests",
          },
        ],
      },
      {
        id: "checkout-client",
        container: "web-app",
        name: "Checkout Client",
        description: "HTTP client for the checkout API.",
        libraries: ["fetch", "zod"],
        metadata: {
          generated: false,
        },
        relationships: [
          {
            target: "checkout-service",
            description: "Calls the checkout API",
          },
        ],
      },
      {
        id: "checkout-service",
        container: "checkout-api",
        name: "Checkout Service",
        description: "Coordinates validation and persistence.",
        libraries: ["express", "stripe", "prisma"],
        metadata: {
          owner: "payments-squad",
        },
        relationships: [
          {
            target: "orders-repository",
            description: "Stores the order",
          },
        ],
      },
      {
        id: "orders-repository",
        container: "checkout-api",
        name: "Orders Repository",
        description: "Persistence adapter for orders.",
        libraries: ["prisma"],
        metadata: {
          owner: "payments-squad",
        },
        relationships: [
          {
            target: "orders-db",
            description: "Uses PostgreSQL",
          },
        ],
      },
    ],
  };
}

export function validateArch3Model(model: unknown): Arch3ValidationResult {
  const errors: string[] = [];

  if (!model || typeof model !== "object") {
    return { ok: false, errors: ["Model must be an object."] };
  }

  const candidate = model as Partial<Arch3Model>;
  const ids = new Set<string>();
  const containersById = new Set<string>();
  const addressableIds = new Set<string>();

  if (candidate.methodology?.name !== "Arch3") {
    errors.push("methodology.name must be 'Arch3'.");
  }

  if (!Array.isArray(candidate.methodology?.layers)) {
    errors.push("methodology.layers must be an array.");
  }

  if (!candidate.scope?.name) {
    errors.push("scope.name is required.");
  }

  const actors = candidate.context?.actors ?? [];
  const systems = candidate.context?.systems ?? [];
  const containers = candidate.containers ?? [];
  const components = candidate.components ?? [];

  if (!Array.isArray(actors) || !Array.isArray(systems)) {
    errors.push("context.actors and context.systems must be arrays.");
  }

  [actors, systems, containers, components].forEach((collection) => {
    if (!Array.isArray(collection)) {
      errors.push("All layer collections must be arrays.");
    }
  });

  const register = (
    element: { id?: string } | null | undefined,
    scope: string
  ): void => {
    if (!element?.id) {
      errors.push(`${scope} entries must have an id.`);
      return;
    }

    if (ids.has(element.id)) {
      errors.push(`Duplicate id detected: ${element.id}`);
      return;
    }

    ids.add(element.id);
    addressableIds.add(element.id);
  };

  actors.forEach((actor) => register(actor, "actors"));
  systems.forEach((system) => register(system, "systems"));

  containers.forEach((container) => {
    register(container, "containers");
    if (container.id) {
      containersById.add(container.id);
    }
    if (!container.system) {
      errors.push(`Container ${container.id} must reference a system.`);
    }
    if (!container.metadata || typeof container.metadata !== "object") {
      errors.push(`Container ${container.id} must have metadata.`);
    }
  });

  components.forEach((component) => {
    register(component, "components");
    if (!component.container || !containersById.has(component.container)) {
      errors.push(
        `Component ${component.id} must reference an existing container.`
      );
    }
    if (!Array.isArray(component.libraries)) {
      errors.push(`Component ${component.id} must declare libraries.`);
    }
  });

  const validateRelationships = (
    elements: Array<{ id: string; relationships?: Arch3Relationship[] }>,
    scope: string
  ): void => {
    elements.forEach((element) => {
      (element.relationships ?? []).forEach((relationship) => {
        if (!relationship.target || !addressableIds.has(relationship.target)) {
          errors.push(
            `${scope} ${element.id} references unknown target ${relationship.target}.`
          );
        }
      });
    });
  };

  validateRelationships(containers, "container");
  validateRelationships(components, "component");

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function assertValidArch3Model(model: unknown): Arch3Model {
  const result = validateArch3Model(model);
  if (!result.ok) {
    throw new Error(result.errors.join("\n"));
  }

  return model as Arch3Model;
}
