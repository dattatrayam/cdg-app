import { ChartPayload, ChartType } from '../types';

function looksLikePie(rows: any[]): boolean {
  if (!rows.length) return false;
  const s = rows[0];
  if ('name' in s && 'value' in s) {
    const total = rows.reduce((a, r) => a + Number(r.value || 0), 0);
    return total > 90 && total <= 110;
  }
  return false;
}
function looksLikeTimeSeries(rows: any[]): boolean {
  if (!rows.length) return false;
  const keys = Object.keys(rows[0]);
  const x = keys.find(k => k.toLowerCase() === 'x' || k.toLowerCase().includes('date'));
  return !!x;
}

export function toChartPayload(title: string, rows: any[], preferred?: ChartType): ChartPayload {
  let type: ChartType = preferred || 'bar';
  let xKey = 'x';
  let yKey = 'y';

  if (looksLikePie(rows)) {
    return { title, type: 'pie', data: rows };
  }
  if (looksLikeTimeSeries(rows)) {
    type = preferred || 'line';
  }
  if (rows.length && (!('x' in rows[0]) || !('y' in rows[0]))) {
    const keys = Object.keys(rows[0]);
    if (keys.length >= 2) { xKey = keys[0]; yKey = keys[1]; }
  }
  return { title, type, data: rows, xKey, yKey };
}
