import Emittery from "emittery";
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
    const EVENT_NAME = "ditto-event";

    const emitter = new Emittery();
    const emit = (/** @type {E} */ event) => emitter.emit(EVENT_NAME, event);
    const emitEffect = (/** @type {E} */ event) => () => emit(event);

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

    emitter.on(EVENT_NAME, (event) => {
      state.value = update(state.value, event, emitEffect)();
      const vnode = fragment([view(state.value)(emit)]);
      oldVnode.value = patch(oldVnode.value, vnode);
    });
  };
}

/** @typedef {ReturnType<typeof import("snabbdom").init>} Patch */
