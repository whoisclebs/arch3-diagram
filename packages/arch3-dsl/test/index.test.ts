import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  getExampleArch3Source,
  getExampleArch3TextSource,
  parseArch3TextAst,
  parseArch3Json,
  parseArch3Source,
  parseArch3Text,
} from "../src/index";

const fixturesRoot = path.resolve(__dirname, "../../../examples/fixtures");

function readFixtureSource(relativePath: string): string {
  return fs.readFileSync(path.join(fixturesRoot, relativePath), "utf8");
}

test("example source parses successfully", () => {
  const model = parseArch3Json(getExampleArch3Source());

  assert.equal(model.methodology.name, "Arch3");
  assert.equal(model.containers.length > 0, true);
});

test("text DSL example parses successfully", () => {
  const model = parseArch3Text(getExampleArch3TextSource());

  assert.equal(model.methodology.name, "Arch3");
  assert.equal(model.containers.length > 0, true);
});

test("text DSL example produces explicit AST", () => {
  const ast = parseArch3TextAst(getExampleArch3TextSource());

  assert.equal(ast.nodes[0]?.type, "methodology");
  assert.equal(ast.nodes.some((node) => node.type === "container"), true);
  assert.equal(ast.nodes.some((node) => node.type === "rel"), true);
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

test("text fixtures parse successfully", () => {
  const source = readFixtureSource("valid/full.arch3");
  const parsed = parseArch3Text(source);

  assert.equal(parsed.scope.name, "Commerce Suite");
  assert.equal(parsed.components.length > 0, true);
});

test("invalid text fixture raises a clear error", () => {
  assert.throws(
    () => parseArch3Text(readFixtureSource("invalid/syntax/unknown-command.arch3")),
    /Unknown Arch3 DSL command/
  );
});

test("auto-detect parser handles JSON and text sources", () => {
  const jsonModel = parseArch3Source(getExampleArch3Source());
  const textModel = parseArch3Source(getExampleArch3TextSource());

  assert.equal(jsonModel.scope.name, "Commerce Suite");
  assert.equal(textModel.scope.name, "Commerce Suite");
});
