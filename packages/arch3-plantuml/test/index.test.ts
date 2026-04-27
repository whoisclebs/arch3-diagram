import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { createExampleModel } from "@arch3/arch3-model";

import { renderPlantUml } from "../src/index";

const fixturesRoot = path.resolve(__dirname, "../../../examples/fixtures");
const snapshotsRoot = path.resolve(__dirname, "../../../examples/snapshots/plantuml");

function readJsonFixture(relativePath: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(fixturesRoot, relativePath), "utf8"));
}

function readSnapshot(relativePath: string): string {
  return fs
    .readFileSync(path.join(snapshotsRoot, relativePath), "utf8")
    .replace(/\r\n/g, "\n")
    .trimEnd();
}

test("renders a containers layer diagram", () => {
  const output = renderPlantUml(createExampleModel(), {
    focusLayer: "containers",
  });

  assert.match(output, /@startuml Arch3/);
  assert.match(output, /!define ARCH3_CONTAINER/);
  assert.match(output, /package \"Containers\"/);
  assert.match(output, /Checkout API/);
});

test("renders expanded components for a container", () => {
  const output = renderPlantUml(createExampleModel(), {
    focusLayer: "components",
    expandedContainer: "checkout-api",
  });

  assert.match(output, /Expanded container: Checkout API/);
  assert.match(output, /ARCH3_LIBRARY\("express"/);
  assert.match(output, /uses lib/);
});

test("matches context snapshot for full fixture", () => {
  const model = readJsonFixture("valid/full.arch3.json") as Parameters<typeof renderPlantUml>[0];
  const output = renderPlantUml(model, { focusLayer: "context" });

  assert.equal(output, readSnapshot("full-context.puml"));
});

test("matches containers snapshot for full fixture", () => {
  const model = readJsonFixture("valid/full.arch3.json") as Parameters<typeof renderPlantUml>[0];
  const output = renderPlantUml(model, { focusLayer: "containers" });

  assert.equal(output, readSnapshot("full-containers.puml"));
});

test("matches components snapshot for full fixture", () => {
  const model = readJsonFixture("valid/full.arch3.json") as Parameters<typeof renderPlantUml>[0];
  const output = renderPlantUml(model, {
    focusLayer: "components",
    expandedContainer: "checkout-api",
  });

  assert.equal(output, readSnapshot("full-components-checkout-api.puml"));
});
