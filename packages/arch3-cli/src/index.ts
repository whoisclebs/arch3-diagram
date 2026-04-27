#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import {
  parseArch3Json,
  parseArch3Source,
  parseArch3Text,
  stringifyArch3Json,
  stringifyArch3Text,
} from "@arch3/arch3-dsl";
import { renderPlantUml } from "@arch3/arch3-plantuml";
import {
  Arch3ValidationError,
  lintArch3Model,
  validateArch3Model,
  validateArch3Schema,
} from "@arch3/arch3-model";

type CliOptions = {
  mode: "full" | "schema" | "semantics";
};

type FileValidationResult = {
  filePath: string;
  ok: boolean;
  issues: Array<{ code: string; path: string; message: string }>;
};

type FileLintResult = {
  filePath: string;
  ok: boolean;
  issues: Array<{ code: string; path: string; message: string }>;
};

function printUsage(): void {
  console.log(`arch3 CLI

Usage:
  arch3 validate <file-or-directory> [--schema-only] [--semantics-only]
  arch3 fixtures [directory]
  arch3 render <file> [--layer <context|containers|components>] [--expand <container-id>] [--output <file>]
  arch3 snapshots [fixture]
  arch3 format <file> [--to json|arch3] [--write]
  arch3 lint <file-or-directory>
  arch3 watch <file-or-directory> [--lint]
`);
}

function collectArch3Files(targetPath: string): string[] {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return [targetPath];
  }

  return fs
    .readdirSync(targetPath, { withFileTypes: true })
    .flatMap((entry) => {
      const absolutePath = path.join(targetPath, entry.name);
      if (entry.isDirectory()) {
        return collectArch3Files(absolutePath);
      }
      return entry.name.endsWith(".json") || entry.name.endsWith(".arch3")
        ? [absolutePath]
        : [];
    })
    .sort();
}

function parseByExtension(filePath: string, source: string): unknown {
  if (filePath.endsWith(".arch3")) {
    return parseArch3Text(source);
  }

  if (filePath.endsWith(".json")) {
    return JSON.parse(source) as unknown;
  }

  return parseArch3Source(source);
}

function formatIssues(
  issues: Array<{ code: string; path: string; message: string }>
): string {
  return issues
    .map((issue) => `  - [${issue.code}] ${issue.path}: ${issue.message}`)
    .join("\n");
}

function validateFile(filePath: string, options: CliOptions): FileValidationResult {
  const source = fs.readFileSync(filePath, "utf8");

  try {
    if (options.mode === "schema") {
      const parsed = parseByExtension(filePath, source);
      const result = validateArch3Schema(parsed);
      return { filePath, ok: result.ok, issues: result.issues };
    }

    if (options.mode === "semantics") {
      const parsed = parseByExtension(filePath, source);
      const result = validateArch3Model(parsed);
      return { filePath, ok: result.ok, issues: result.issues };
    }

    if (filePath.endsWith(".json")) {
      parseArch3Json(source);
    } else {
      parseArch3Source(source);
    }
    return { filePath, ok: true, issues: [] };
  } catch (error) {
    if (error instanceof Arch3ValidationError) {
      return { filePath, ok: false, issues: error.issues };
    }

    if (error instanceof Error) {
      return {
        filePath,
        ok: false,
        issues: [
          {
            code: "parse.invalid_json",
            path: "$",
            message: error.message,
          },
        ],
      };
    }

    return {
      filePath,
      ok: false,
      issues: [
        {
          code: "parse.unknown_error",
          path: "$",
          message: "Unknown validation error.",
        },
      ],
    };
  }
}

function parseOptions(args: string[]): CliOptions {
  if (args.includes("--schema-only")) {
    return { mode: "schema" };
  }
  if (args.includes("--semantics-only")) {
    return { mode: "semantics" };
  }
  return { mode: "full" };
}

function runValidate(args: string[]): number {
  const target = args.find((arg) => !arg.startsWith("--"));
  if (!target) {
    printUsage();
    return 1;
  }

  const targetPath = path.resolve(process.cwd(), target);
  if (!fs.existsSync(targetPath)) {
    console.error(`Path not found: ${target}`);
    return 1;
  }

  const options = parseOptions(args);
  const files = collectArch3Files(targetPath);
  const results = files.map((filePath) => validateFile(filePath, options));
  const failures = results.filter((result) => !result.ok);

  results.forEach((result) => {
    const relative = path.relative(process.cwd(), result.filePath) || result.filePath;
    if (result.ok) {
      console.log(`PASS ${relative}`);
      return;
    }

    console.log(`FAIL ${relative}`);
    console.log(formatIssues(result.issues));
  });

  console.log(
    `\nValidated ${results.length} file(s): ${results.length - failures.length} passed, ${failures.length} failed.`
  );

  return failures.length === 0 ? 0 : 1;
}

function runFixtures(args: string[]): number {
  const target = args[0] ?? "examples/fixtures";
  const targetPath = path.resolve(process.cwd(), target);
  return runValidate([targetPath]);
}

function readOptionValue(args: string[], optionName: string): string | undefined {
  const optionIndex = args.indexOf(optionName);
  if (optionIndex === -1) {
    return undefined;
  }
  return args[optionIndex + 1];
}

function runRender(args: string[]): number {
  const target = args.find((arg) => !arg.startsWith("--"));
  if (!target) {
    printUsage();
    return 1;
  }

  const targetPath = path.resolve(process.cwd(), target);
  if (!fs.existsSync(targetPath)) {
    console.error(`Path not found: ${target}`);
    return 1;
  }

  const source = fs.readFileSync(targetPath, "utf8");
  const layer = readOptionValue(args, "--layer") as
    | "context"
    | "containers"
    | "components"
    | undefined;
  const expandedContainer = readOptionValue(args, "--expand");
  const outputFile = readOptionValue(args, "--output");

  try {
    const model = parseArch3Source(source);
    const rendered = renderPlantUml(model, {
      focusLayer: layer,
      expandedContainer,
    });

    if (outputFile) {
      const outputPath = path.resolve(process.cwd(), outputFile);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, rendered, "utf8");
      console.log(`Wrote PlantUML output to ${outputFile}`);
      return 0;
    }

    console.log(rendered);
    return 0;
  } catch (error) {
    if (error instanceof Arch3ValidationError) {
      console.error(formatIssues(error.issues));
      return 1;
    }

    console.error(error instanceof Error ? error.message : "Unknown render error.");
    return 1;
  }
}

function runSnapshots(args: string[]): number {
  const target = args[0] ?? "examples/fixtures/valid/full.arch3";
  const targetPath = path.resolve(process.cwd(), target);

  if (!fs.existsSync(targetPath)) {
    console.error(`Path not found: ${target}`);
    return 1;
  }

  const source = fs.readFileSync(targetPath, "utf8");
  const outputDir = path.resolve(process.cwd(), "examples/snapshots/plantuml");

  try {
    const model = parseArch3Source(source);
    const jobs: Array<{ fileName: string; focusLayer: "context" | "containers" | "components"; expandedContainer?: string }> = [
      { fileName: "full-context.puml", focusLayer: "context" },
      { fileName: "full-containers.puml", focusLayer: "containers" },
      {
        fileName: "full-components-checkout-api.puml",
        focusLayer: "components",
        expandedContainer: "checkout-api",
      },
    ];

    fs.mkdirSync(outputDir, { recursive: true });

    jobs.forEach((job) => {
      const rendered = renderPlantUml(model, {
        focusLayer: job.focusLayer,
        expandedContainer: job.expandedContainer,
      });
      const outputPath = path.join(outputDir, job.fileName);
      fs.writeFileSync(outputPath, `${rendered}\n`, "utf8");
      console.log(`Wrote snapshot ${path.relative(process.cwd(), outputPath)}`);
    });

    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unknown snapshot error.");
    return 1;
  }
}

function runFormat(args: string[]): number {
  const target = args.find((arg) => !arg.startsWith("--"));
  if (!target) {
    printUsage();
    return 1;
  }

  const targetPath = path.resolve(process.cwd(), target);
  if (!fs.existsSync(targetPath)) {
    console.error(`Path not found: ${target}`);
    return 1;
  }

  const source = fs.readFileSync(targetPath, "utf8");
  const targetFormat = (readOptionValue(args, "--to") ?? "json") as "json" | "arch3";
  const write = args.includes("--write");

  try {
    const model = parseArch3Source(source);
    const formatted =
      targetFormat === "arch3" ? stringifyArch3Text(model) : stringifyArch3Json(model);

    if (write) {
      fs.writeFileSync(targetPath, formatted, "utf8");
      console.log(`Formatted ${target} as ${targetFormat}`);
      return 0;
    }

    console.log(formatted);
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unknown format error.");
    return 1;
  }
}

function lintFile(filePath: string): FileLintResult {
  const source = fs.readFileSync(filePath, "utf8");

  try {
    const model = parseArch3Source(source);
    const lintResult = lintArch3Model(model);
    return {
      filePath,
      ok: lintResult.ok,
      issues: lintResult.issues.map((issue) => ({
        code: issue.code,
        path: issue.path,
        message: issue.message,
      })),
    };
  } catch (error) {
    return {
      filePath,
      ok: false,
      issues: [
        {
          code: "lint.parse_failed",
          path: "$",
          message: error instanceof Error ? error.message : "Unknown lint error.",
        },
      ],
    };
  }
}

function printLintResults(results: FileLintResult[]): number {
  let issuesCount = 0;

  results.forEach((result) => {
    const relative = path.relative(process.cwd(), result.filePath) || result.filePath;

    if (result.ok) {
      console.log(`PASS ${relative}`);
      return;
    }

    console.log(`WARN ${relative}`);
    result.issues.forEach((issue) => {
      console.log(`  - [${issue.code}] ${issue.path}: ${issue.message}`);
    });
    issuesCount += result.issues.length;
  });

  console.log(`\nLinted ${results.length} file(s) with ${issuesCount} issue(s).`);
  return issuesCount;
}

function runLint(args: string[]): number {
  const target = args.find((arg) => !arg.startsWith("--"));
  if (!target) {
    printUsage();
    return 1;
  }

  const targetPath = path.resolve(process.cwd(), target);
  if (!fs.existsSync(targetPath)) {
    console.error(`Path not found: ${target}`);
    return 1;
  }

  const files = collectArch3Files(targetPath);
  const issuesCount = printLintResults(files.map((filePath) => lintFile(filePath)));
  return issuesCount === 0 ? 0 : 1;
}

function clearConsole(): void {
  process.stdout.write("\x1Bc");
}

function runWatch(args: string[]): number {
  const target = args.find((arg) => !arg.startsWith("--"));
  if (!target) {
    printUsage();
    return 1;
  }

  const targetPath = path.resolve(process.cwd(), target);
  if (!fs.existsSync(targetPath)) {
    console.error(`Path not found: ${target}`);
    return 1;
  }

  const lintMode = args.includes("--lint");

  const execute = () => {
    clearConsole();
    console.log(`[arch3 watch] ${new Date().toISOString()}`);
    if (lintMode) {
      runLint([target]);
    } else {
      runValidate([target]);
    }
  };

  execute();

  fs.watch(targetPath, { recursive: true }, (_eventType, fileName) => {
    if (!fileName) {
      return;
    }

    if (!fileName.endsWith(".json") && !fileName.endsWith(".arch3")) {
      return;
    }

    execute();
  });

  console.log(`\nWatching ${target} ${lintMode ? "with lint" : "with validation"}. Press Ctrl+C to stop.`);
  return 0;
}

export function main(argv: string[]): number {
  const [command, ...rest] = argv;

  if (!command || command === "--help" || command === "-h") {
    printUsage();
    return 0;
  }

  if (command === "validate") {
    return runValidate(rest);
  }

  if (command === "fixtures") {
    return runFixtures(rest);
  }

  if (command === "render") {
    return runRender(rest);
  }

  if (command === "snapshots") {
    return runSnapshots(rest);
  }

  if (command === "format") {
    return runFormat(rest);
  }

  if (command === "lint") {
    return runLint(rest);
  }

  if (command === "watch") {
    return runWatch(rest);
  }

  printUsage();
  return 1;
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
