import assert from "node:assert/strict";
import test from "node:test";

import { getExampleArch3Source, parseArch3Json } from "../src/index";

test("example source parses successfully", () => {
  const model = parseArch3Json(getExampleArch3Source());

  assert.equal(model.methodology.name, "Arch3");
  assert.equal(model.containers.length > 0, true);
});

test("invalid json raises a clear error", () => {
  assert.throws(() => parseArch3Json("{ invalid json"), /Invalid Arch3 JSON/);
});
