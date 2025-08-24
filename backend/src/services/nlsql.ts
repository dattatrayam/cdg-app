// import { generateSqlFromPrompt } from './bq';
// import { sanitizeGeneratedSql } from './guard';

// export async function nlToSqlSafe(nl: string): Promise<{ sql: string; explanation: string }> {
//   // Ask BigQuery AI for SQL
//   const raw = await generateSqlFromPrompt(nl);
//   // Guardrails
//   const sql = sanitizeGeneratedSql(raw);
//   return { sql, explanation: 'NL→SQL via ML.GENERATE_TEXT with guardrails.' };
// }


import { generateSqlFromPrompt} from './bq';
import { sanitizeGeneratedSql } from './guard';
import { store } from '../store';

/**
 * Converts natural language -> SQL safely using BigQuery AI
 * and applies dataSource restrictions.
 */
export async function nlToSqlSafe(
  nl: string,
  dataSourceId: string
): Promise<{ sql: string; explanation: string }> {
  const dataSource = store.getDataSource(dataSourceId);
  if (!dataSource) {
    throw new Error(`Invalid dataSourceId: ${dataSourceId}`);
  }
  console.log('dataSource', dataSource);
  // Ask BigQuery AI to generate SQL
  const raw = await generateSqlFromPrompt(
    `${nl}. Only use table \`${dataSource.projectId}.${dataSource.dataset}.${dataSource.table}\``,dataSourceId
  );

  // Guardrails to prevent dangerous SQL
  const sql = sanitizeGeneratedSql(raw);

  return {
    sql,
    explanation: `NL→SQL via ML.GENERATE_TEXT restricted to ${dataSourceId}`,
  };
}
