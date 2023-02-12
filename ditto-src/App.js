import {
  init as initPatch,
  fragment,
  propsModule,
  classModule,
  eventListenersModule,
} from "snabbdom";

/**
 * @template S
 * @template E
 * @param {(cb: (event: E) => () => void) => () => S } init
 * @param {Parameters<Patch>[0]} container
 * @param {(state: S) => import("./Html").Html<E>} view
 * @param {(state: S, event: E, cb: (event: E) => () => void) => () => S} update
 * @returns {() => void}
 */
export function mount_impl(init, container, view, update) {
  return () => {
    const bus = document.appendChild(document.createComment("vdom-event-bus"));
    const emit = (/** @type {E} */ event) => {
      return new Promise((resolve) => {
        resolve(
          bus.dispatchEvent(new CustomEvent("bus-event", { detail: event }))
        );
      });
    };
    const emitEffect = (/** @type {E} */ event) => () => {
      emit(event);
    };
    const patch = initPatch(
      [propsModule, classModule, eventListenersModule],
      undefined,
      {
        experimental: { fragments: true },
      }
    );
    const initialState = init(emitEffect)();
    const state = { value: initialState };
    const oldVnode = { value: fragment([view(state.value)(emit)]) };
    patch(container, oldVnode.value);
    bus.addEventListener("bus-event", (event) => {
      if (event instanceof CustomEvent) {
        state.value = update(state.value, event.detail, emitEffect)();
        const vnode = fragment([view(state.value)(emit)]);
        patch(oldVnode.value, vnode);
        oldVnode.value = vnode;
      }
    });
  };
}

/** @typedef {ReturnType<typeof import("snabbdom").init>} Patch */
