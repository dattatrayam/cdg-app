
import { BigQuery } from '@google-cloud/bigquery';
import fs from 'fs';
import path from 'path';
import { store } from '../store';

const USE_MOCK = process.env.USE_MOCK || true;
const LOCATION = process.env.BQ_LOCATION || 'US';
const LLM_MODEL = process.env.LLM_MODEL || 'my_bqml_dataset.text_model'

export const MOCK_DATA = {
  shakespeare: [
    { x: 'Hamlet', y: 120, description: 'Famous for existential angst and drama' },
    { x: 'Macbeth', y: 150, description: 'Power, ambition, and witches galore' },
    { x: 'Othello', y: 90, description: 'Tragedy of jealousy and betrayal' },
    { x: 'King Lear', y: 110, description: 'Epic family drama and madness' },
  ],
  covid: [
    { x: '2023-01', y: 2000, description: 'Cases start the year high' },
    { x: '2023-02', y: 1800, description: 'Slight dip as vaccination improves' },
    { x: '2023-03', y: 2200, description: 'Cases spike due to new variants' },
  ],
  citibike: [
    { x: 'Station A', y: 300, description: 'Busy downtown hub' },
    { x: 'Station B', y: 500, description: 'High traffic near subway' },
    { x: 'Station C', y: 150, description: 'Quieter residential area' },
  ],
};

export function getMockData(datasetId: keyof typeof MOCK_DATA) {
  return MOCK_DATA[datasetId];
}



let bq: BigQuery | null = null;
if (!USE_MOCK) {
  const credentialsPath = path.resolve('service-account.json');
  if (!fs.existsSync(credentialsPath)) {
    throw new Error('service-account.json not found in project root');
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));


  bq = new BigQuery({
    // keyFilename: 'service-account.json',
    credentials: credentials,
    location: 'US',
  })
};

// Helper: get fully qualified table from dataSourceId
function getTableFqn(dataSourceId: string) {
  const ds = store.listDataSources().find(d => d.id === dataSourceId);
  if (!ds) throw new Error(`Unknown dataSourceId: ${dataSourceId}`);
  return `${ds.projectId}.${ds.dataset}.${ds.table}`;
}

// --- SQL Execution ---
export async function runSQL(
  sql?: string,
  dataSourceId?: string,
  params?: Record<string, any>
): Promise<any[]> {
  if (USE_MOCK) {
    return dataSourceId ? getMockData(dataSourceId as any) : [];
  }

  let query = sql;
  if (!query && dataSourceId) {
    // Use selected data source with default LIMIT 10
    query = `SELECT * FROM \`${getTableFqn(dataSourceId)}\` LIMIT 10`;
  } else if (!query) {
    // fallback default
    query = `
      SELECT 'Mon' AS x, 120 AS y UNION ALL
      SELECT 'Tue', 200 UNION ALL
      SELECT 'Wed', 150 UNION ALL
      SELECT 'Thu', 280 UNION ALL
      SELECT 'Fri', 220
    `;
  }

  const [rows] = await bq!.query({ query, location: LOCATION, params });
  return rows as any[];
}

// --- Generative AI in SQL ---
// NL -> SQL using ML.GENERATE_TEXT
export async function generateSqlFromPrompt(prompt: string, dataSourceId?: string): Promise<string> {
  if (USE_MOCK) {
    return `SELECT 'US' AS x, 3200 AS y UNION ALL SELECT 'IN', 2800 UNION ALL SELECT 'UK', 1500`;
  }
  const query = `
    SELECT
      ml_generate_text_result.candidates[0].output_text AS sql_query
    FROM
      ML.GENERATE_TEXT(
        MODEL \`${LLM_MODEL}\`,
        (SELECT @p AS prompt)
      )
  `;

  
  const allowedDatasets = dataSourceId ? getTableFqn(dataSourceId) : process.env.ALLOWED_DATASETS;
  
  const [rows] = await bq!.query({
    query,
    location: LOCATION,
    params: { p: `Generate a safe BigQuery SELECT with LIMIT for this request. Use only allowed datasets: ${allowedDatasets}. Request: ${prompt}` }
  });

  const raw = String(rows[0].sql_query || '').replace(/```(sql)?/gi, '').trim();
  return raw;
}

// AI.GENERATE_TABLE to produce structured chart spec + insight
export async function generateChartSpec(prompt: string) {
  if (USE_MOCK) {
    return [{ chart_type: 'bar', x_axis: 'x', y_axis: 'y', insight: 'Sales vary by region.' }];
  }

  const query = `
    SELECT * FROM AI.GENERATE_TABLE(
      MODEL \`${process.env.LLM_MODEL || 'bqai_llm.text_bison'}\`,
      (SELECT @p AS prompt),
      TABLE_SCHEMA<
        chart_type STRING,
        x_axis STRING,
        y_axis STRING,
        insight STRING
      >
    )
  `;
  const [rows] = await bq!.query({ query, location: LOCATION, params: { p: prompt } });
  return rows as any[];
}

// AI.FORECAST on a table/time/value
export async function runForecast(
  dataSourceId: string,
  timeCol: string,
  valueCol: string,
  horizon = 12
) {
  if (USE_MOCK) {
    return [
      { x: 'Next 1', y: 17300 },
      { x: 'Next 2', y: 18150 },
      { x: 'Next 3', y: 17690 }
    ];
  }

  const tableFqn = getTableFqn(dataSourceId);

  const query = `
    SELECT * FROM AI.FORECAST(
      TABLE \`${tableFqn}\`,
      STRUCT(@timeCol AS time_series_timestamp_col,
             @valueCol AS time_series_data_col,
             @horizon AS horizon)
    )
  `;
  const [rows] = await bq!.query({ query, location: LOCATION, params: { timeCol, valueCol, horizon } });
  return rows as any[];
}

