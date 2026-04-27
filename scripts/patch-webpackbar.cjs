const fs = require("node:fs");
const path = require("node:path");

const files = [
  path.join(__dirname, "..", "node_modules", "webpackbar", "dist", "index.cjs"),
  path.join(__dirname, "..", "node_modules", "webpackbar", "dist", "index.mjs"),
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    continue;
  }

  let source = fs.readFileSync(filePath, "utf8");
  const progressPluginReference = filePath.endsWith(".mjs")
    ? "Webpack.ProgressPlugin"
    : "Webpack__default.ProgressPlugin";

  source = source.replace(
    /class WebpackBarPlugin extends Webpack(?:__default)?\.ProgressPlugin \{/g,
    "class WebpackBarPlugin {"
  );

  source = source.replace(
    /\s+super\(\{ activeModules: true \}\);/g,
    `\n    this.progressPlugin = new ${progressPluginReference}({ activeModules: true });`
  );

  source = source.replace(
    /\s+super\.apply\(compiler\);/g,
    "\n    this.progressPlugin.apply(compiler);"
  );

  source = source.replace(
    /this\.progressPlugin = new Webpack(?:__default)?\.ProgressPlugin\(\{ activeModules: true \}\);/g,
    `this.progressPlugin = new ${progressPluginReference}({ activeModules: true });`
  );

  fs.writeFileSync(filePath, source, "utf8");
}

console.log("webpackbar patch applied.");
