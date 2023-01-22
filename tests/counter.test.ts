import { getByText, within } from "@testing-library/dom";
import { main } from "../dist/Example_Counter";

function renderCounter() {
  const root = document.createElement("div");
  const container = document.createElement("div");
  root.appendChild(container);
  main(container)();
  return root;
}

test("clicking the buttons", async () => {
  const container = renderCounter();

  const increment = () => within(container).getByText("+").click();
  const decrement = () => within(container).getByText("-").click();

  increment();
  increment();
  increment();
  decrement();

  expect(container).toMatchSnapshot();
});
