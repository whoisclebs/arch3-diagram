import {
  assertValidArch3Model,
  createExampleModel,
  type Arch3Model,
} from "@arch3/arch3-model";

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
