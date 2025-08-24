import { Router } from 'express';
import { store } from '../store';
import { nlToSqlSafe } from '../services/nlsql';
import { runSQL } from '../services/bq';
import { toChartPayload } from '../services/format';

const router = Router();

// Get chat history for a dashboard
router.get('/:id/messages', (req, res) => {
  const { id } = req.params;
  const session = store.getSession(id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// Send a message -> NL→SQL -> run SQL -> chart
router.post('/:id/messages', async (req, res) => {
  const { id } = req.params;
  const { message } = req.body as { message: string };
  console.log('message', message);
  if (!message) return res.status(400).json({ error: 'message is required' });

  let session = store.getSession(id);
  console.log('session', session);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  try {
    session.messages.push({ role: 'user', content: message, ts: Date.now() });

    // Use session.dataSourceId when running SQL
    const { sql, explanation } = await nlToSqlSafe(message, session.dataSourceId || '');
    console.log('sql', sql);
    console.log('explanation', explanation);
    const rows = await runSQL(sql, session.dataSourceId);
    const chart = toChartPayload('Result', rows);

    session.lastChart = chart;
    session.messages.push({
      role: 'ai',
      content: `I generated SQL and created a ${chart.type} chart.\n${explanation}`,
      ts: Date.now()
    });

    store.upsertSession(session);

    res.json({
      reply: session.messages[session.messages.length - 1],
      chart,
      sql
    });
  } catch (err: any) {
    session.messages.push({ role: 'ai', content: `Query failed: ${err?.message}`, ts: Date.now() });
    store.upsertSession(session);
    res.status(500).json({ error: 'Query failed', detail: err?.message });
  }
});

export default router;
