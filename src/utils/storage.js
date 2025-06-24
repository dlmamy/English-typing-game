export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getItem(key, defaultValue) {
  const v = localStorage.getItem(key);
  if (v === null) return defaultValue;
  try {
    return JSON.parse(v);
  } catch {
    return defaultValue;
  }
} 