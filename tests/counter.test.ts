import { within, waitFor } from "@testing-library/dom";
import { main as Counter } from "../dist/Example_Counter";

function renderCounter() {
  const root = document.createElement("div");
  const container = document.createElement("div");
  root.appendChild(container);
  Counter(container)();
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
  await waitFor(() => {
    within(container).getByText("2");
  });

  expect(container).toMatchSnapshot();
});
