// Module-level registry — same singleton-Map idea as the React version.
// name -> api (an object of methods published by a component).
//
// The Map is wrapped in `shallowReactive` so registry *membership* is tracked
// by Vue's reactivity: reading a key with `getComponent` inside a computed/watch
// registers a dependency, and `registerComponent`/`unregisterComponent` trigger
// re-evaluation. This is what makes cross-component wiring reactive — a consumer
// that renders before its sibling has registered will re-run automatically once
// registration happens, with no post-mount `nextTick` bump required.
//
// `shallowReactive` tracks add/set/delete on the Map but does not deeply proxy
// the stored APIs, so `getComponent` returns the raw api object and its methods
// close over the producer's own refs (which stay reactive on their own).
import { shallowReactive } from "vue";

const registry = shallowReactive(new Map<string, unknown>());

export function registerComponent<T>(name: string, api: T) {
  registry.set(name, api);
}

export function unregisterComponent(name: string) {
  registry.delete(name);
}

export function getComponent<T>(name: string): T {
  const component = registry.get(name);
  if (!component) {
    console.error(`No component registered for "${name}"`);
  }
  return component as T;
}
