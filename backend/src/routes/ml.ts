import { Router } from 'express';
import { runForecast } from '../services/bq';
import { toChartPayload } from '../services/format';

const router = Router();

/**
 * Body: { table: "project.dataset.table", timeCol: "date", valueCol: "sales", horizon?: 12 }
 */
router.post('/forecast', async (req, res) => {
  const { table, timeCol, valueCol, horizon } = req.body || {};
  if (!table || !timeCol || !valueCol) return res.status(400).json({ error: 'table, timeCol, valueCol are required' });

  try {
    const rows = await runForecast(table, timeCol, valueCol, horizon || 12);
    const chart = toChartPayload('Forecast', rows, 'line');
    res.json({ chart, rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Forecast failed', detail: err?.message });
  }
});

export default router;
