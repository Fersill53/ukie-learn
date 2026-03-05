export function uid(prefix = ''): string {
  // Good-enough local id (no crypto dependency)
  const rand = Math.random().toString(16).slice(2);
  const time = Date.now().toString(16);
  return `${prefix}${time}-${rand}`;
}