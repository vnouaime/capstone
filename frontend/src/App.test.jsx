import React from "react";
import { render } from "vitest-react";
import App from "./App";

test("smoke test", () => {
    render(<App />);
});
