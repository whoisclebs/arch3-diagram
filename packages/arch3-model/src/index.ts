import Ajv2020 from "ajv/dist/2020";
import { type ErrorObject, type ValidateFunction } from "ajv";
import arch3Schema from "./schema/arch3.schema.json";

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
  issues: Arch3ValidationIssue[];
  errors: string[];
};

export type Arch3ValidationIssue = {
  code: string;
  path: string;
  message: string;
};

export type Arch3LintSeverity = "warning" | "error";

export type Arch3LintIssue = {
  code: string;
  path: string;
  message: string;
  severity: Arch3LintSeverity;
};

export type Arch3LintResult = {
  ok: boolean;
  issues: Arch3LintIssue[];
};

export class Arch3ValidationError extends Error {
  issues: Arch3ValidationIssue[];

  constructor(issues: Arch3ValidationIssue[]) {
    super(issues.map((issue) => issue.message).join("\n"));
    this.name = "Arch3ValidationError";
    this.issues = issues;
  }
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
const schemaValidator = ajv.compile(arch3Schema) as ValidateFunction;

export const ARCH3_JSON_SCHEMA = arch3Schema;

function formatSchemaPath(instancePath: string): string {
  if (!instancePath || instancePath === "") {
    return "$";
  }

  return `$${instancePath.replace(/\//g, ".")}`;
}

function pushSchemaIssues(
  schemaErrors: ErrorObject[] | null | undefined,
  issues: Arch3ValidationIssue[]
): void {
  (schemaErrors ?? []).forEach((schemaError) => {
    const keyword = schemaError.keyword;
    const path = formatSchemaPath(schemaError.instancePath);
    const missingProperty =
      keyword === "required" && typeof schemaError.params.missingProperty === "string"
        ? schemaError.params.missingProperty
        : null;

    pushIssue(
      issues,
      `schema.${keyword}`,
      missingProperty ? `${path}.${missingProperty}` : path,
      schemaError.message ?? `Schema validation failed for keyword '${keyword}'.`
    );
  });
}

export function validateArch3Schema(model: unknown): Arch3ValidationResult {
  const ok = schemaValidator(model) as boolean;
  const issues: Arch3ValidationIssue[] = [];

  if (!ok) {
    pushSchemaIssues(schemaValidator.errors, issues);
  }

  return {
    ok,
    issues,
    errors: issues.map((issue) => issue.message),
  };
}

function pushIssue(
  issues: Arch3ValidationIssue[],
  code: string,
  path: string,
  message: string
): void {
  issues.push({ code, path, message });
}

function isPrimitiveMetadataValue(
  value: unknown
): value is string | number | boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function validateMetadata(
  metadata: unknown,
  ownerLabel: string,
  path: string,
  issueBase: "container" | "component",
  issues: Arch3ValidationIssue[]
): void {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    pushIssue(
      issues,
      `${issueBase}.invalid_metadata`,
      path,
      `${ownerLabel} must have metadata.`
    );
    return;
  }

  Object.entries(metadata).forEach(([key, value]) => {
    if (!isPrimitiveMetadataValue(value)) {
      pushIssue(
        issues,
        `${issueBase}.invalid_metadata_value`,
        `${path}.${key}`,
        `${ownerLabel} has invalid metadata value for key '${key}'.`
      );
    }
  });
}

function validateRelationships(
  elements: Array<{ id: string; relationships?: Arch3Relationship[] }>,
  scope: string,
  addressableIds: Set<string>,
  issues: Arch3ValidationIssue[]
): void {
  elements.forEach((element, elementIndex) => {
    (element.relationships ?? []).forEach((relationship, relationshipIndex) => {
      if (!relationship.target || !addressableIds.has(relationship.target)) {
        pushIssue(
          issues,
          "relationship.unknown_target",
          `${scope}s[${elementIndex}].relationships[${relationshipIndex}].target`,
          `${scope} ${element.id} references unknown target ${relationship.target}.`
        );
      }

      if (
        typeof relationship.description !== "string" ||
        relationship.description.trim().length === 0
      ) {
        pushIssue(
          issues,
          "relationship.missing_description",
          `${scope}s[${elementIndex}].relationships[${relationshipIndex}].description`,
          `${scope} ${element.id} must define a relationship description.`
        );
      }
    });
  });
}

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
  const schemaResult = validateArch3Schema(model);
  if (!schemaResult.ok) {
    return schemaResult;
  }

  const issues: Arch3ValidationIssue[] = [];

  if (!model || typeof model !== "object") {
    return {
      ok: false,
      issues: [
        {
          code: "model.invalid_type",
          path: "$",
          message: "Model must be an object.",
        },
      ],
      errors: ["Model must be an object."],
    };
  }

  const candidate = model as Partial<Arch3Model>;
  const ids = new Set<string>();
  const systemsById = new Set<string>();
  const containersById = new Set<string>();
  const addressableIds = new Set<string>();

  if (candidate.methodology?.name !== "Arch3") {
    pushIssue(
      issues,
      "methodology.invalid_name",
      "methodology.name",
      "methodology.name must be 'Arch3'."
    );
  }

  if (!Array.isArray(candidate.methodology?.layers)) {
    pushIssue(
      issues,
      "methodology.invalid_layers",
      "methodology.layers",
      "methodology.layers must be an array."
    );
  }

  if (!candidate.scope?.name) {
    pushIssue(issues, "scope.missing_name", "scope.name", "scope.name is required.");
  }

  if (!candidate.context) {
    pushIssue(issues, "context.missing", "context", "context is required.");
  }

  if (!Array.isArray(candidate.containers)) {
    pushIssue(
      issues,
      "containers.invalid_type",
      "containers",
      "containers must be an array."
    );
  }

  if (!Array.isArray(candidate.components)) {
    pushIssue(
      issues,
      "components.invalid_type",
      "components",
      "components must be an array."
    );
  }

  const actors = candidate.context?.actors ?? [];
  const systems = candidate.context?.systems ?? [];
  const containers = candidate.containers ?? [];
  const components = candidate.components ?? [];

  if (!Array.isArray(actors) || !Array.isArray(systems)) {
    pushIssue(
      issues,
      "context.invalid_collections",
      "context",
      "context.actors and context.systems must be arrays."
    );
  }

  [actors, systems, containers, components].forEach((collection) => {
    if (!Array.isArray(collection)) {
      pushIssue(
        issues,
        "collections.invalid_type",
        "$",
        "All layer collections must be arrays."
      );
    }
  });

  const register = (
    element: { id?: string } | null | undefined,
    scope: string,
    path: string
  ): void => {
    if (!element?.id) {
      pushIssue(issues, "entity.missing_id", path, `${scope} entries must have an id.`);
      return;
    }

    if (ids.has(element.id)) {
      pushIssue(issues, "entity.duplicate_id", path, `Duplicate id detected: ${element.id}`);
      return;
    }

    ids.add(element.id);
    addressableIds.add(element.id);
  };

  actors.forEach((actor, index) =>
    register(actor, "actors", `context.actors[${index}]`)
  );
  systems.forEach((system, index) => {
    register(system, "systems", `context.systems[${index}]`);
    if (system.id) {
      systemsById.add(system.id);
    }
  });

  containers.forEach((container, index) => {
    register(container, "containers", `containers[${index}]`);
    if (container.id) {
      containersById.add(container.id);
    }
    if (!container.system || !systemsById.has(container.system)) {
      pushIssue(
        issues,
        "container.unknown_system",
        `containers[${index}].system`,
        `Container ${container.id} must reference an existing system.`
      );
    }

    validateMetadata(
      container.metadata,
      `Container ${container.id}`,
      `containers[${index}].metadata`,
      "container",
      issues
    );
  });

  components.forEach((component, index) => {
    register(component, "components", `components[${index}]`);
    if (!component.container || !containersById.has(component.container)) {
      pushIssue(
        issues,
        "component.unknown_container",
        `components[${index}].container`,
        `Component ${component.id} must reference an existing container.`
      );
    }
    if (!Array.isArray(component.libraries)) {
      pushIssue(
        issues,
        "component.missing_libraries",
        `components[${index}].libraries`,
        `Component ${component.id} must declare libraries.`
      );
    }

    validateMetadata(
      component.metadata,
      `Component ${component.id}`,
      `components[${index}].metadata`,
      "component",
      issues
    );
  });

  validateRelationships(containers, "container", addressableIds, issues);
  validateRelationships(components, "component", addressableIds, issues);

  return {
    ok: issues.length === 0,
    issues,
    errors: issues.map((issue) => issue.message),
  };
}

export function assertValidArch3Model(model: unknown): Arch3Model {
  const result = validateArch3Model(model);
  if (!result.ok) {
    throw new Arch3ValidationError(result.issues);
  }

  return model as Arch3Model;
}

function pushLintIssue(
  issues: Arch3LintIssue[],
  code: string,
  path: string,
  message: string,
  severity: Arch3LintSeverity = "warning"
): void {
  issues.push({ code, path, message, severity });
}

function isKebabCase(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function lintArch3Model(model: unknown): Arch3LintResult {
  const validModel = assertValidArch3Model(model);
  const issues: Arch3LintIssue[] = [];

  if (!isKebabCase(validModel.scope.name.toLowerCase().replace(/\s+/g, "-"))) {
    // no-op placeholder to avoid empty top-level lint category for now
  }

  validModel.containers.forEach((container, index) => {
    if (!isKebabCase(container.id)) {
      pushLintIssue(
        issues,
        "lint.container.id_not_kebab_case",
        `containers[${index}].id`,
        `Container id '${container.id}' should use kebab-case.`
      );
    }

    if (!("owner" in container.metadata)) {
      pushLintIssue(
        issues,
        "lint.container.missing_owner",
        `containers[${index}].metadata.owner`,
        `Container ${container.id} should declare metadata.owner.`
      );
    }

    if (!("tier" in container.metadata)) {
      pushLintIssue(
        issues,
        "lint.container.missing_tier",
        `containers[${index}].metadata.tier`,
        `Container ${container.id} should declare metadata.tier.`
      );
    }

    if (container.relationships.length === 0) {
      pushLintIssue(
        issues,
        "lint.container.no_relationships",
        `containers[${index}].relationships`,
        `Container ${container.id} has no declared relationships.`
      );
    }
  });

  validModel.components.forEach((component, index) => {
    if (!isKebabCase(component.id)) {
      pushLintIssue(
        issues,
        "lint.component.id_not_kebab_case",
        `components[${index}].id`,
        `Component id '${component.id}' should use kebab-case.`
      );
    }

    if (component.libraries.length === 0) {
      pushLintIssue(
        issues,
        "lint.component.no_libraries",
        `components[${index}].libraries`,
        `Component ${component.id} should declare at least one library.`
      );
    }

    if (!("owner" in component.metadata)) {
      pushLintIssue(
        issues,
        "lint.component.missing_owner",
        `components[${index}].metadata.owner`,
        `Component ${component.id} should declare metadata.owner.`
      );
    }
  });

  return {
    ok: issues.length === 0,
    issues,
  };
}
