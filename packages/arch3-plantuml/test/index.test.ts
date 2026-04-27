import assert from "node:assert/strict";
import test from "node:test";

import { createExampleModel } from "@arch3/arch3-model";

import { renderPlantUml } from "../src/index";

test("renders a containers layer diagram", () => {
  const output = renderPlantUml(createExampleModel(), {
    focusLayer: "containers",
  });

  assert.match(output, /@startuml Arch3/);
  assert.match(output, /package \"Containers\"/);
  assert.match(output, /Checkout API/);
});

test("renders expanded components for a container", () => {
  const output = renderPlantUml(createExampleModel(), {
    focusLayer: "components",
    expandedContainer: "checkout-api",
  });

  assert.match(output, /Expanded container: Checkout API/);
  assert.match(output, /libs: express, stripe, prisma/);
});
