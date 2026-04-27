import { renderToStaticMarkup } from "react-dom/server";

jest.mock("./components/Landing", () => () => <div>arch3-diagram editor</div>);

import App from "./App";

describe("App", () => {
  it("renders the arch3-diagram editor title", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain("arch3-diagram editor");
  });
});
