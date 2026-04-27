import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  ARCH3_JSON_SCHEMA,
  createExampleModel,
  lintArch3Model,
  validateArch3Model,
  validateArch3Schema,
  type Arch3ValidationIssue,
} from "../src/index";

const fixturesRoot = path.resolve(__dirname, "../../../examples/fixtures");

function readFixture(relativePath: string): unknown {
  const absolutePath = path.join(fixturesRoot, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function assertHasIssue(
  issues: Arch3ValidationIssue[],
  code: string,
  pathPrefix?: string
): void {
  const match = issues.find(
    (issue) => issue.code === code && (!pathPrefix || issue.path.startsWith(pathPrefix))
  );

  assert.ok(match, `Expected issue ${code}${pathPrefix ? ` at ${pathPrefix}` : ""}`);
}

test("example model is valid", () => {
  const result = validateArch3Model(createExampleModel());

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("json schema is exported", () => {
  assert.equal(ARCH3_JSON_SCHEMA.title, "Arch3 Model v0.1");
});

test("invalid component container is rejected", () => {
  const model = createExampleModel();
  model.components[0]!.container = "missing-container";

  const result = validateArch3Model(model);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /must reference an existing container/);
  assertHasIssue(result.issues, "component.unknown_container", "components[0].container");
});

test("valid fixtures pass validation", () => {
  const validFixtures = [
    "valid/minimal.arch3.json",
    "valid/full.arch3.json",
    "valid/context-only.arch3.json",
    "valid/containers-only.arch3.json",
    "valid/components-expanded.arch3.json",
  ];

  validFixtures.forEach((fixturePath) => {
    const result = validateArch3Model(readFixture(fixturePath));

    assert.equal(result.ok, true, fixturePath);
    assert.deepEqual(result.errors, [], fixturePath);
  });
});

test("valid fixtures pass schema validation", () => {
  const validFixtures = [
    "valid/minimal.arch3.json",
    "valid/full.arch3.json",
    "valid/context-only.arch3.json",
    "valid/containers-only.arch3.json",
    "valid/components-expanded.arch3.json",
  ];

  validFixtures.forEach((fixturePath) => {
    const result = validateArch3Schema(readFixture(fixturePath));

    assert.equal(result.ok, true, fixturePath);
    assert.deepEqual(result.errors, [], fixturePath);
  });
});

test("invalid structure fixtures fail validation", () => {
  const invalidFixtures = [
    "invalid/structure/missing-methodology.arch3.json",
    "invalid/structure/missing-scope.arch3.json",
    "invalid/structure/missing-context.arch3.json",
    "invalid/structure/missing-components.arch3.json",
  ];

  invalidFixtures.forEach((fixturePath) => {
    const result = validateArch3Model(readFixture(fixturePath));

    assert.equal(result.ok, false, fixturePath);
    assert.notEqual(result.errors.length, 0, fixturePath);
    assert.notEqual(result.issues.length, 0, fixturePath);
  });
});

test("invalid structure fixtures fail schema validation", () => {
  const invalidFixtures = [
    "invalid/structure/missing-methodology.arch3.json",
    "invalid/structure/missing-scope.arch3.json",
    "invalid/structure/missing-context.arch3.json",
    "invalid/structure/missing-components.arch3.json",
  ];

  invalidFixtures.forEach((fixturePath) => {
    const result = validateArch3Schema(readFixture(fixturePath));

    assert.equal(result.ok, false, fixturePath);
    assert.notEqual(result.issues.length, 0, fixturePath);
  });
});

test("invalid semantic fixtures fail validation", () => {
  const invalidFixtures = [
    "invalid/semantics/duplicate-ids.arch3.json",
    "invalid/semantics/unknown-target.arch3.json",
    "invalid/semantics/unknown-system.arch3.json",
    "invalid/semantics/unknown-container.arch3.json",
    "invalid/semantics/invalid-metadata-type.arch3.json",
    "invalid/semantics/missing-relationship-description.arch3.json",
  ];

  invalidFixtures.forEach((fixturePath) => {
    const result = validateArch3Model(readFixture(fixturePath));

    assert.equal(result.ok, false, fixturePath);
    assert.notEqual(result.errors.length, 0, fixturePath);
    assert.notEqual(result.issues.length, 0, fixturePath);
  });
});

test("semantic fixtures expose structured validation issues", () => {
  const duplicateIds = validateArch3Model(
    readFixture("invalid/semantics/duplicate-ids.arch3.json")
  );
  assertHasIssue(duplicateIds.issues, "entity.duplicate_id", "context.systems[0]");

  const unknownTarget = validateArch3Model(
    readFixture("invalid/semantics/unknown-target.arch3.json")
  );
  assertHasIssue(
    unknownTarget.issues,
    "relationship.unknown_target",
    "containers[0].relationships[0].target"
  );

  const invalidMetadata = validateArch3Model(
    readFixture("invalid/semantics/invalid-metadata-type.arch3.json")
  );
  assertHasIssue(
    invalidMetadata.issues,
    "schema.type",
    "$.containers.0.metadata.owner"
  );
});

test("lint reports advisory issues for style and governance", () => {
  const lintResult = lintArch3Model(readFixture("valid/lint-warnings.arch3.json"));

  assert.equal(lintResult.ok, false);
  assert.equal(
    lintResult.issues.some((issue) => issue.code === "lint.container.id_not_kebab_case"),
    true
  );
  assert.equal(
    lintResult.issues.some((issue) => issue.code === "lint.container.missing_owner"),
    true
  );
  assert.equal(
    lintResult.issues.some((issue) => issue.code === "lint.component.no_libraries"),
    true
  );
});
