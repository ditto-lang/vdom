import {
  init,
  fragment,
  classModule,
  propsModule,
  eventListenersModule,
} from "snabbdom";

/**
 * @template S
 * @template E
 * @param {S}  initialState
 * @param {Parameters<typeof run>[2]} container
 * @param {(state: S) => import("./HTML").HTML<E>} view
 * @param {(state: S, event: E) => S} update
 * @returns {() => void}
 */
export function main_impl(initialState, container, view, update) {
  return () => {
    const patch = init(
      [classModule, propsModule, eventListenersModule],
      undefined,
      { experimental: { fragments: true } }
    );
    const state = { value: initialState };
    run(patch, state, container, view, update);
  };
}

/**
 * @template Maybe
 * @param {string} elementId
 * @param {(element: HTMLElement) => Maybe} Just
 * @param {Maybe} Nothing
 * @returns {() => Maybe}
 */
export function get_element_by_id_impl(elementId, Just, Nothing) {
  return () => {
    const element = document.getElementById(elementId);
    if (element !== null) {
      return Just(element);
    }
    return Nothing;
  };
}

/**
 * @template S
 * @template E
 * @param {Patch} patch
 * @param {{value: S}} state
 * @param {Parameters<Patch>[0]} oldVnode
 * @param {(state: S) => import("./HTML").HTML<E>} view
 * @param {(state: S, event: E) => S} update
 * @returns {void}
 */
function run(patch, state, oldVnode, view, update) {
  const vnode = fragment([
    view(state.value)((event) => {
      state.value = update(state.value, event);
      run(patch, state, vnode, view, update);
    }),
  ]);
  patch(oldVnode, vnode);
}

/** @typedef {ReturnType<typeof import("snabbdom").init>} Patch */
