export function getVisitorId(): string {
  const key = 'visitorId';
  let v = localStorage.getItem(key);
  if (v) return v;
  v = generateId();
  try {
    localStorage.setItem(key, v);
  } catch {
    /* Pending: ignore write failures (e.g., Safari private mode) */
  }
  return v;
}

function generateId(): string {
  const s: string[] = [];
  const hex = '0123456789abcdef';
  for (let i = 0; i < 36; i++) s[i] = hex[Math.floor(Math.random() * 16)];
  s[14] = '4';
  const r = Math.floor(Math.random() * 16);
  s[19] = hex[((r & 0x3) | 0x8)];
  s[8] = s[13] = s[18] = s[23] = '-';
  return s.join('');
}
