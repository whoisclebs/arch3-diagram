import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import { classnames } from "../utils/general";
import plantumlEncoder from 'plantuml-encoder';
import {
  Arch3ValidationError,
  getArch3FixtureSources,
  getExampleArch3Source,
  parseArch3Json,
} from "@arch3/arch3-dsl";
import { renderPlantUml } from "@arch3/arch3-plantuml";

import { defineTheme } from "../lib/defineTheme";
import Footer from "./Footer";

const arch3Default = getExampleArch3Source();
const fixtureSources = getArch3FixtureSources();

type FocusLayer = "context" | "containers" | "components";

const Landing = (): JSX.Element => {
  const [url, setUrl] = useState<string | null>(null);
  const [code, setCode] = useState<string>(arch3Default);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<Array<{ code: string; path: string; message: string }>>([]);
  const [focusLayer, setFocusLayer] = useState<FocusLayer>("containers");
  const [expandedContainer, setExpandedContainer] = useState("checkout-api");
  const [selectedFixture, setSelectedFixture] = useState<string>("full");
  const [theme, setTheme] = useState<{ value: string; label: string }>({
    value: "cobalt",
    label: "Cobalt",
  });

  const onChange = (action: "code", data: string) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const handleCompile = () => {
    setProcessing(true);
    setError(null);
    setIssues([]);

    try {
      const model = parseArch3Json(code);
      const plantUml = renderPlantUml(model, {
        focusLayer,
        expandedContainer,
      });
      const encoded = plantumlEncoder.encode(plantUml);
      const compiledUrl = `https://www.plantuml.com/plantuml/svg/${encoded}`;
      setUrl(compiledUrl);
    } catch (compileError) {
      setUrl(null);
      if (compileError instanceof Arch3ValidationError) {
        setIssues(compileError.issues);
      }
      setError(compileError instanceof Error ? compileError.message : "Unknown compile error");
    } finally {
      setProcessing(false);
    }
  };

  const handleFixtureChange = (fixtureId: string) => {
    const fixture = fixtureSources.find((item) => item.id === fixtureId);
    if (!fixture) {
      return;
    }

    setSelectedFixture(fixtureId);
    setCode(fixture.source);
    setError(null);
    setIssues([]);
    setUrl(null);
  };

  useEffect(() => {
    defineTheme("oceanic-next").then(() =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  return (
    <>
      <div className="h-4 w-full bg-gradient-to-r from-purple-800 via-purple-500 to-purple-200"></div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <div className="w-full pb-3 text-sm text-slate-700">
            <h1 className="text-2xl font-semibold pb-2">
              arch3-diagram editor
            </h1>
            <p>
              AI-first diagram as code in JSON, focused on context,
              containers, and components.
            </p>
          </div>
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            theme={theme.value}
            language="json"
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[50%] flex-col">
          <div className="flex flex-col items-end gap-3">
            <div className="w-full flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 p-4">
              <label className="text-sm font-medium text-slate-700">
                Fixture
              </label>
              <select
                className="rounded border border-slate-300 px-2 py-1"
                value={selectedFixture}
                onChange={(event) => handleFixtureChange(event.target.value)}
              >
                {fixtureSources.map((fixture) => (
                  <option key={fixture.id} value={fixture.id}>
                    {fixture.label}
                  </option>
                ))}
              </select>

              <label className="text-sm font-medium text-slate-700">
                Layer
              </label>
              <select
                className="rounded border border-slate-300 px-2 py-1"
                value={focusLayer}
                onChange={(event) =>
                  setFocusLayer(event.target.value as FocusLayer)
                }
              >
                <option value="context">Context</option>
                <option value="containers">Containers</option>
                <option value="components">Components</option>
              </select>

              <label className="text-sm font-medium text-slate-700">
                Expanded container
              </label>
              <input
                className="rounded border border-slate-300 px-2 py-1"
                value={expandedContainer}
                onChange={(event) => setExpandedContainer(event.target.value)}
              />
            </div>
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {error ? (
            <pre className="mt-4 whitespace-pre-wrap rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </pre>
          ) : null}
          {issues.length > 0 ? (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <h2 className="pb-2 font-semibold">Validation issues</h2>
              <ul className="list-disc space-y-2 pl-5">
                {issues.map((issue, index) => (
                  <li key={`${issue.code}-${issue.path}-${index}`}>
                    <code className="font-mono text-xs">{issue.code}</code> at <code className="font-mono text-xs">{issue.path}</code>
                    <div>{issue.message}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {url ? <img src={url} width="720" alt="arch3 diagram preview" /> : null}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Landing;
