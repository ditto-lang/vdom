import Emittery from "emittery";
import {
  init as initPatch,
  fragment,
  attributesModule,
  propsModule,
  classModule,
  eventListenersModule,
} from "snabbdom";

/**
 * @template S
 * @template E
 * @param {(cb: (event: E) => () => void) => () => S } init
 * @param {Parameters<Patch>[0]} container
 * @param {(state: S) => import("./Html").Html<E>[]} view
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
      [attributesModule, propsModule, classModule, eventListenersModule],
      undefined,
      {
        experimental: { fragments: true },
      }
    );
    const initialState = init(emitEffect)();
    const state = { value: initialState };
    const htmls = view(state.value).map((html) => html(emit));
    const oldVnode = { value: patch(container, fragment(htmls)) };

    emitter.on(EVENT_NAME, (event) => {
      state.value = update(state.value, event, emitEffect)();
      const htmls = view(state.value).map((html) => html(emit));
      oldVnode.value = patch(oldVnode.value, fragment(htmls));
    });
  };
}

/** @typedef {ReturnType<typeof import("snabbdom").init>} Patch */
