import assert from "node:assert/strict";
import test from "node:test";

import { createExampleModel, validateArch3Model } from "../src/index";

test("example model is valid", () => {
  const result = validateArch3Model(createExampleModel());

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("invalid component container is rejected", () => {
  const model = createExampleModel();
  model.components[0]!.container = "missing-container";

  const result = validateArch3Model(model);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /must reference an existing container/);
});
