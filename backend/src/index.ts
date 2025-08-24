import express from 'express';
import cors from 'cors';
import dashboards from './routes/dashboards';
import chat from './routes/chat';
import insights from './routes/insights';
import ml from './routes/ml';
import sql from './routes/sql';
import dataSourcesRouter from './routes/dataSources';



const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/dashboards', dashboards);
app.use('/api/chat', chat);
app.use('/api/insights', insights);
app.use('/api/ml', ml);
app.use('/api/sql', sql);
app.use('/api/data-sources', dataSourcesRouter);


const PORT = Number(process.env.PORT || 5500);
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log(`USE_MOCK=${process.env.USE_MOCK === '1' ? 'ON' : 'OFF'}`);
});
