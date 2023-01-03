import {
  init,
  fragment,
  propsModule,
  classModule,
  eventListenersModule,
} from "snabbdom";

/**
 * @template S
 * @template E
 * @param {S}  initialState
 * @param {Parameters<Patch>[0]} container
 * @param {(state: S) => import("./Html").Html<E>} view
 * @param {(state: S, event: E, cb: (event: E) => () => void) => () => S} update
 * @returns {() => void}
 */
export function mount_impl(initialState, container, view, update) {
  return () => {
    const bus = document.appendChild(document.createComment("vdom-event-bus"));
    const emit = (/** @type {E} */ event) => {
      return bus.dispatchEvent(new CustomEvent("bus-event", { detail: event }));
    };
    const patch = init(
      [propsModule, classModule, eventListenersModule],
      undefined,
      {
        experimental: { fragments: true },
      }
    );
    const state = { value: initialState };
    const oldVnode = { value: fragment([view(state.value)(emit)]) };
    patch(container, oldVnode.value);
    bus.addEventListener("bus-event", (event) => {
      if (event instanceof CustomEvent) {
        state.value = update(state.value, event.detail, (e) => () => emit(e))();
        const vnode = fragment([view(state.value)(emit)]);
        patch(oldVnode.value, vnode);
        oldVnode.value = vnode;
      }
    });
  };
}

/** @typedef {ReturnType<typeof import("snabbdom").init>} Patch */
