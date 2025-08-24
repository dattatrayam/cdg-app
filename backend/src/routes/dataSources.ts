import { Router } from 'express';
import { store } from '../store';

const router = Router();

// GET all data sources
router.get('/', (req, res) => {
  res.json(store.listDataSources());
});

// GET a single data source by id
router.get('/:id', (req, res) => {
  const ds = store.getDataSource(req.params.id);
  if (!ds) {
    return res.status(404).json({ error: 'Data source not found' });
  }
  res.json(ds);
});

export default router;
