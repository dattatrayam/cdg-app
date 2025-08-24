import { Router } from 'express';
import { generateChartSpec } from '../services/bq';

const router = Router();

/** Produce chart spec + insight via AI.GENERATE_TABLE */
router.post('/', async (req, res) => {
  const { prompt } = req.body as { prompt: string };
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  try {
    const rows = await generateChartSpec(prompt);
    const first = rows[0] || { chart_type: 'bar', x_axis: 'x', y_axis: 'y', insight: 'No insight.' };
    res.json({ spec: { type: first.chart_type, xKey: first.x_axis, yKey: first.y_axis }, insight: first.insight });
  } catch (err: any) {
    res.status(500).json({ error: 'Insight generation failed', detail: err?.message });
  }
});

export default router;
