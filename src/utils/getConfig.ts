export async function getConfig(name: string) {
  const path = `../config/${name}.ts`;
  const modules = import.meta.glob("../config/*");
  return ((await modules[path]()) as any).default;
}
