import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "docs/intro.md",
  "docs/methodology/arch3.md",
  "docs/reference/official-notation.md",
  "docs/reference/diagram-as-code.md",
  "i18n/es/docusaurus-plugin-content-docs/current/intro.md",
  "i18n/pt-BR/docusaurus-plugin-content-docs/current/intro.md",
  "sidebars.ts",
  "docusaurus.config.ts",
];

requiredFiles.forEach((relativePath) => {
  const absolutePath = path.join(__dirname, "..", relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing docs artifact: ${relativePath}`);
  }
});

console.log("Docs smoke check passed.");
