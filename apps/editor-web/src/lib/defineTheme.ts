import { loader } from "@monaco-editor/react";

const monacoThemes = {
  active4d: "Active4D",
  "all-hallows-eve": "All Hallows Eve",
  amy: "Amy",
  "birds-of-paradise": "Birds of Paradise",
  blackboard: "Blackboard",
  "brilliance-black": "Brilliance Black",
  "brilliance-dull": "Brilliance Dull",
  "chrome-devtools": "Chrome DevTools",
  "clouds-midnight": "Clouds Midnight",
  clouds: "Clouds",
  cobalt: "Cobalt",
  dawn: "Dawn",
  dreamweaver: "Dreamweaver",
  eiffel: "Eiffel",
  "espresso-libre": "Espresso Libre",
  github: "GitHub",
  idle: "IDLE",
  katzenmilch: "Katzenmilch",
  "kuroir-theme": "Kuroir Theme",
  lazy: "LAZY",
  "magicwb--amiga-": "MagicWB (Amiga)",
  "merbivore-soft": "Merbivore Soft",
  merbivore: "Merbivore",
  "monokai-bright": "Monokai Bright",
  monokai: "Monokai",
  "night-owl": "Night Owl",
  "oceanic-next": "Oceanic Next",
  "pastels-on-dark": "Pastels on Dark",
  "slush-and-poppies": "Slush and Poppies",
  "solarized-dark": "Solarized-dark",
  "solarized-light": "Solarized-light",
  spacecadet: "SpaceCadet",
  sunburst: "Sunburst",
  "textmate--mac-classic-": "Textmate (Mac Classic)",
  "tomorrow-night-blue": "Tomorrow-Night-Blue",
  "tomorrow-night-bright": "Tomorrow-Night-Bright",
  "tomorrow-night-eighties": "Tomorrow-Night-Eighties",
  "tomorrow-night": "Tomorrow-Night",
  tomorrow: "Tomorrow",
  twilight: "Twilight",
  "upstream-sunburst": "Upstream Sunburst",
  "vibrant-ink": "Vibrant Ink",
  "xcode-default": "Xcode_default",
  zenburnesque: "Zenburnesque",
  iplastic: "iPlastic",
  idlefingers: "idleFingers",
  krtheme: "krTheme",
  monoindustrial: "monoindustrial",
};

const defineTheme = (theme: keyof typeof monacoThemes): Promise<void> => {
  return new Promise((resolve) => {
    Promise.all([
      loader.init(),
      import(`monaco-themes/themes/${monacoThemes[theme]}.json`),
    ]).then(([monaco, themeData]) => {
      const resolvedTheme =
        "default" in themeData ? themeData.default : themeData;

      monaco.editor.defineTheme(theme, resolvedTheme);
      resolve();
    });
  });
};

const registerArch3Language = (): Promise<void> => {
  return new Promise((resolve) => {
    loader.init().then((monaco) => {
      if (
        monaco.languages
          .getLanguages()
          .some((language) => language.id === "arch3")
      ) {
        resolve();
        return;
      }

      monaco.languages.register({ id: "arch3" });
      monaco.languages.setMonarchTokensProvider("arch3", {
        keywords: ["methodology", "scope", "actor", "system", "container", "component", "rel"],
        tokenizer: {
          root: [
            [/^\s*#.*/, "comment"],
            [/"[^"\\]*(?:\\.[^"\\]*)*"/, "string"],
            [/\b(?:methodology|scope|actor|system|container|component|rel)\b/, "keyword"],
            [/\blibs=[^\s]+/, "type.identifier"],
            [/\b[a-zA-Z_][\w-]*=([^\s]+)/, "attribute.name"],
            [/\b(?:true|false)\b/, "keyword"],
            [/\b\d+(?:\.\d+)?\b/, "number"],
            [/\b[a-z0-9]+(?:-[a-z0-9]+)*\b/, "identifier"],
          ],
        },
      });

      monaco.languages.registerCompletionItemProvider("arch3", {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          return {
            suggestions: [
              {
                label: "methodology",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: "methodology Arch3 0.1.0 context containers components",
                range,
              },
              {
                label: "scope",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'scope "Scope Name" "Scope description"',
                range,
              },
              {
                label: "actor",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'actor actor-id "Actor Name" "Actor description"',
                range,
              },
              {
                label: "system",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'system system-id "System Name" "System description"',
                range,
              },
              {
                label: "container",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText:
                  'container container-id system-id "Container Name" "Technology" "Description" owner=team tier=critical',
                range,
              },
              {
                label: "component",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText:
                  'component component-id container-id "Component Name" "Description" libs=library-one,library-two owner=team',
                range,
              },
              {
                label: "rel",
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'rel from-id target-id "Relationship description"',
                range,
              },
            ],
          };
        },
      });

      resolve();
    });
  });
};

export { defineTheme, registerArch3Language };
