import { Router } from 'express';
// import { nanoid } from 'nanoid';
import { store } from '../store';

const router = Router();

// Create new dashboard session
router.post('/', (req, res) => {
  const { dataSourceId } = req.body;

  if (!dataSourceId) {
    return res.status(400).json({ error: 'dataSourceId is required' });
  }
  const dashboardLength = store.getSessionCount() + 1;;
  const id = `dashboard-${dashboardLength}`;
  const session = store.createSession(id, dataSourceId);
  res.json({ dashboardId: id, session });
});

// List recent dashboards
router.get('/', (req, res) => {
  const limit = Number(req.query.limit || 10);
  res.json(store.listRecent(limit));
});

// Get a specific dashboard session
router.get('/:id', (req, res) => {
  const session = store.getSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Dashboard not found' });
  }
  res.json(session);
});

export default router;
