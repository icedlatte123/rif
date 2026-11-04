const cloneForAudit = (value) => {
  if (value === undefined) return null;
  if (value === null || typeof value !== "object") return value;
  try { return JSON.parse(JSON.stringify(value)); } catch { return String(value); }
};

export const collectChanges = (before, after, path = "", changes = []) => {
  if (changes.length >= 500 || Object.is(before, after)) return changes;
  if (Array.isArray(before) && Array.isArray(after)) {
    const keyedItems = before.every((item) => item && typeof item === "object" && item.id) && after.every((item) => item && typeof item === "object" && item.id);
    if (keyedItems) {
      const ids = new Set([...before.map((item) => item.id), ...after.map((item) => item.id)]);
      for (const id of ids) {
        const beforeItem = before.find((item) => item.id === id);
        const afterItem = after.find((item) => item.id === id);
        collectChanges(beforeItem, afterItem, `${path}[${id}]`, changes);
      }
    } else {
      const length = Math.max(before.length, after.length);
      for (let index = 0; index < length; index += 1) collectChanges(before[index], after[index], `${path}[${index + 1}]`, changes);
    }
    return changes;
  }
  if (before && after && typeof before === "object" && typeof after === "object" && !Array.isArray(before) && !Array.isArray(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of keys) collectChanges(before[key], after[key], path ? `${path}.${key}` : key, changes);
    return changes;
  }
  changes.push({ field: path || "value", before: cloneForAudit(before), after: cloneForAudit(after) });
  return changes;
};
