import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { getExampleArch3Source, parseArch3Json } from "../src/index";

const fixturesRoot = path.resolve(__dirname, "../../../examples/fixtures");

function readFixtureSource(relativePath: string): string {
  return fs.readFileSync(path.join(fixturesRoot, relativePath), "utf8");
}

test("example source parses successfully", () => {
  const model = parseArch3Json(getExampleArch3Source());

  assert.equal(model.methodology.name, "Arch3");
  assert.equal(model.containers.length > 0, true);
});

test("invalid json raises a clear error", () => {
  assert.throws(() => parseArch3Json("{ invalid json"), /Invalid Arch3 JSON/);
});

test("invalid syntax fixtures raise parse errors", () => {
  const invalidSyntaxFixtures = [
    "invalid/syntax/malformed-json.arch3.json",
    "invalid/syntax/truncated-json.arch3.json",
  ];

  invalidSyntaxFixtures.forEach((fixturePath) => {
    assert.throws(
      () => parseArch3Json(readFixtureSource(fixturePath)),
      /Invalid Arch3 JSON/,
      fixturePath
    );
  });
});

test("valid fixtures parse successfully", () => {
  const validFixtures = [
    "valid/minimal.arch3.json",
    "valid/full.arch3.json",
    "valid/context-only.arch3.json",
    "valid/containers-only.arch3.json",
    "valid/components-expanded.arch3.json",
  ];

  validFixtures.forEach((fixturePath) => {
    const parsed = parseArch3Json(readFixtureSource(fixturePath));

    assert.equal(parsed.methodology.name, "Arch3", fixturePath);
  });
});
