const fs = require("node:fs");
const path = require("node:path");

const source = path.join(__dirname, "..", "src", "schema", "arch3.schema.json");
const targetDir = path.join(__dirname, "..", "dist", "schema");
const target = path.join(targetDir, "arch3.schema.json");

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, target);

console.log("Arch3 JSON Schema copied to dist/schema.");
