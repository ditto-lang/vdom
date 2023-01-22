import { within } from "@testing-library/dom";
import { main as Ticker } from "../dist/Example_Ticker";

function renderCounter() {
  const root = document.createElement("div");
  const container = document.createElement("div");
  root.appendChild(container);
  Ticker(container)();
  return root;
}

test("ticker renders", async () => {
  const container = renderCounter();
  within(container).getByText(/\d+/);
});
