import { within, waitFor } from "@testing-library/dom";
import { main as Hooks } from "../dist/Example_Hooks";

function renderHooks() {
  const root = document.createElement("div");
  const container = document.createElement("div");
  root.appendChild(container);
  Hooks(container)();
  return root;
}

test("toggling", async () => {
  const container = renderHooks();
  within(container).getByText("toggle").click();
  const boo = await waitFor(() => within(container).getByText("boo"));
  within(container).getByText("toggle").click();
  expect(boo).not.toBeInTheDocument();
});
