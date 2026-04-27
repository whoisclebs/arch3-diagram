import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const packageRoot = path.resolve(__dirname, "..");
const cliEntry = path.join(packageRoot, "dist", "index.js");
const repoRoot = path.resolve(packageRoot, "../..");

function runCli(args: string[]): { stdout: string; status: number } {
  try {
    const stdout = execFileSync("node", [cliEntry, ...args], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    return { stdout, status: 0 };
  } catch (error) {
    const failure = error as { stdout?: string; status?: number };
    return { stdout: failure.stdout ?? "", status: failure.status ?? 1 };
  }
}

test("cli validates valid fixture successfully", () => {
  const result = runCli(["validate", "examples/fixtures/valid/minimal.arch3.json"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /PASS examples\\fixtures\\valid\\minimal\.arch3\.json|PASS examples\/fixtures\/valid\/minimal\.arch3\.json/);
});

test("cli reports semantic failure for invalid fixture", () => {
  const result = runCli(["validate", "examples/fixtures/invalid/semantics/unknown-target.arch3.json"]);

  assert.equal(result.status, 1);
  assert.match(result.stdout, /relationship\.unknown_target/);
});

test("cli validates fixture directory", () => {
  const result = runCli(["fixtures", "examples/fixtures/valid"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Validated 7 file\(s\): 7 passed, 0 failed\./);
});

test("cli validates text DSL fixtures", () => {
  const result = runCli(["validate", "examples/fixtures/valid/full.arch3"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /PASS examples\\fixtures\\valid\\full\.arch3|PASS examples\/fixtures\/valid\/full\.arch3/);
});

test("cli renders plantuml from text DSL", () => {
  const result = runCli([
    "render",
    "examples/fixtures/valid/full.arch3",
    "--layer",
    "components",
    "--expand",
    "checkout-api",
  ]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /@startuml Arch3/);
  assert.match(result.stdout, /ARCH3_COMPONENT\("Checkout Service"/);
});

test("cli regenerates official snapshots", () => {
  const snapshotPath = path.join(
    repoRoot,
    "examples",
    "snapshots",
    "plantuml",
    "full-context.puml"
  );
  const before = fs.readFileSync(snapshotPath, "utf8");

  const result = runCli(["snapshots", "examples/fixtures/valid/full.arch3"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Wrote snapshot/);
  const after = fs.readFileSync(snapshotPath, "utf8");
  assert.equal(after, before);
});

test("cli formats text DSL to JSON", () => {
  const result = runCli(["format", "examples/fixtures/valid/full.arch3", "--to", "json"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /"methodology"/);
  assert.match(result.stdout, /"scope"/);
});

test("cli formats JSON to text DSL", () => {
  const result = runCli(["format", "examples/fixtures/valid/full.arch3.json", "--to", "arch3"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /methodology Arch3 0\.1\.0/);
  assert.match(result.stdout, /container web-app commerce-suite/);
});

test("cli reports lint warnings", () => {
  const result = runCli(["lint", "examples/fixtures/valid/lint-warnings.arch3.json"]);

  assert.equal(result.status, 1);
  assert.match(result.stdout, /WARN /);
  assert.match(result.stdout, /lint\.container\.missing_owner/);
  assert.match(result.stdout, /lint\.component\.no_libraries/);
});

test("cli usage includes watch command", () => {
  const result = runCli(["--help"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /arch3 watch <file-or-directory> \[--lint\]/);
});
