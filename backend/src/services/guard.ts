const DEFAULT_LIMIT = Number(process.env.DEFAULT_LIMIT || 100);
const ALLOWED_DATASETS = (process.env.ALLOWED_DATASETS || '').split(',').map(s => s.trim()).filter(Boolean);

export function ensureSelectOnly(sql: string) {
  const s = sql.trim().toUpperCase();
  if (!s.startsWith('SELECT')) throw new Error('Only SELECT queries are allowed.');
}

export function enforceLimit(sql: string): string {
  const hasLimit = /\blimit\s+\d+/i.test(sql);
  return hasLimit ? sql : `${sql}\nLIMIT ${DEFAULT_LIMIT}`;
}

export function restrictDatasets(sql: string) {
  if (ALLOWED_DATASETS.length === 0) return;
  const bad = /`?([a-z0-9_-]+)\.([a-z0-9_-]+)\.([a-z0-9_*.-]+)`?/gi;
  let m;
  while ((m = bad.exec(sql)) !== null) {
    const ds = `${m[1]}.${m[2]}`; // project.dataset
    if (!ALLOWED_DATASETS.includes(ds)) {
      throw new Error(`Dataset not allowed: ${ds}`);
    }
  }
}

export function sanitizeGeneratedSql(sql: string) {
  ensureSelectOnly(sql);
  restrictDatasets(sql);
  return enforceLimit(sql);
}
