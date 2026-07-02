// Module-level registry — same singleton-Map idea as the React version.
// name -> { validate(value): boolean }
const registry = new Map();
 
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
  return component;
}
 