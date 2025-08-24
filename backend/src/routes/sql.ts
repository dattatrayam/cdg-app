import { Router } from 'express';
import { runSQL } from '../services/bq';
import { sanitizeGeneratedSql } from '../services/guard';

const router = Router();

router.post('/execute', async (req, res) => {
  const { sql } = req.body as { sql: string };
  if (!sql) return res.status(400).json({ error: 'sql is required' });

  try {
    const safe = sanitizeGeneratedSql(sql);
    const rows = await runSQL(safe);
    res.json({ rows });
  } catch (err: any) {
    res.status(400).json({ error: 'Invalid SQL', detail: err?.message });
  }
});

export default router;
