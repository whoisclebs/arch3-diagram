import { act } from "react";
import { createRoot } from "react-dom/client";

// @ts-expect-error test environment flag for React act
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

var mockParseArch3Source = jest.fn((_: string) => ({
  scope: { name: "Example" },
  context: { actors: [], systems: [] },
  containers: [],
  components: [],
  methodology: { name: "Arch3", version: "0.1.0", layers: [] },
}));
jest.mock("@whoisclebs/arch3-dsl", () => ({
  Arch3ValidationError: class extends Error {
    issues: Array<{ code: string; path: string; message: string }>;

    constructor(issues: Array<{ code: string; path: string; message: string }>) {
      super(issues.map((issue) => issue.message).join("\n"));
      this.issues = issues;
    }
  },
  getArch3FixtureSources: () => [
    {
      id: "minimal",
      label: "Minimal",
      source: '{"scope":{"name":"Minimal"}}',
      format: "json",
    },
    {
      id: "full",
      label: "Full",
      source: '{"scope":{"name":"Full"}}',
      format: "json",
    },
    {
      id: "full-text",
      label: "Full Text",
      source: 'methodology Arch3 0.1.0 context containers components',
      format: "arch3",
    },
  ],
  getExampleArch3Source: () => '{"scope":{"name":"Example"}}',
  parseArch3Source: (source: string) => mockParseArch3Source(source),
}));

var mockRenderPlantUml = jest.fn(
  (_model?: unknown, _options?: unknown) => "@startuml\n@enduml"
);

jest.mock("@whoisclebs/arch3-plantuml", () => ({
  renderPlantUml: (model: unknown, options: unknown) =>
    mockRenderPlantUml(model, options),
}));

jest.mock("plantuml-encoder", () => ({
  encode: () => "encoded-diagram",
}));

jest.mock("../lib/defineTheme", () => ({
  defineTheme: () => Promise.resolve(),
  registerArch3Language: () => Promise.resolve(),
}));

jest.mock("./Footer", () => () => <div>footer</div>);

jest.mock("./CodeEditorWindow", () => {
  return ({ code, onChange }: { code: string; onChange: (action: "code", data: string) => void }) => (
    <textarea
      aria-label="code-editor"
      value={code}
      onChange={(event) => onChange("code", event.target.value)}
    />
  );
});

import Landing from "./Landing";
import { Arch3ValidationError } from "@whoisclebs/arch3-dsl";

function clickByText(container: HTMLElement, text: string): void {
  const button = Array.from(container.querySelectorAll("button")).find(
    (element) => element.textContent === text
  );

  if (!button) {
    throw new Error(`Button not found: ${text}`);
  }

  button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

describe("Landing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads fixture content from selector", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    await act(async () => {
      createRoot(container).render(<Landing />);
    });

    const select = container.querySelectorAll("select")[0] as HTMLSelectElement;

    await act(async () => {
      select.value = "minimal";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect((container.querySelector("textarea") as HTMLTextAreaElement).value).toBe(
      '{"scope":{"name":"Minimal"}}'
    );
  });

  it("shows structured validation issues", async () => {
    let invocationCount = 0;
    mockParseArch3Source.mockImplementation(() => {
      invocationCount += 1;
      if (invocationCount === 1) {
        return {
          scope: { name: "Example" },
          context: { actors: [], systems: [] },
          containers: [],
          components: [],
          methodology: { name: "Arch3", version: "0.1.0", layers: [] },
        };
      }

      throw new Arch3ValidationError([
        {
          code: "scope.missing_name",
          path: "scope.name",
          message: "scope.name is required.",
        },
      ]);
    });

    const container = document.createElement("div");
    document.body.appendChild(container);

    await act(async () => {
      createRoot(container).render(<Landing />);
    });

    await act(async () => {
      clickByText(container, "Compile and Execute");
    });

    expect(container.textContent).toContain("Validation issues");
    expect(container.textContent).toContain("scope.missing_name");
    expect(container.textContent).toContain("scope.name is required.");
  });

  it("shows source format for textual fixtures", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    await act(async () => {
      createRoot(container).render(<Landing />);
    });

    const select = container.querySelectorAll("select")[0] as HTMLSelectElement;

    await act(async () => {
      select.value = "full-text";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(container.textContent).toContain("Arch3 DSL");
  });

  it("renders preview image after successful compile", async () => {
    mockParseArch3Source.mockReturnValue({
      scope: { name: "Full" },
      context: { actors: [], systems: [] },
      containers: [],
      components: [],
      methodology: { name: "Arch3", version: "0.1.0", layers: [] },
    });

    const container = document.createElement("div");
    document.body.appendChild(container);

    await act(async () => {
      createRoot(container).render(<Landing />);
    });

    await act(async () => {
      clickByText(container, "Compile and Execute");
    });

    expect(mockRenderPlantUml).toHaveBeenCalled();
    expect(
      (container.querySelector('img[alt="arch3 diagram preview"]') as HTMLImageElement).src
    ).toContain("https://www.plantuml.com/plantuml/svg/encoded-diagram");
  });
});
