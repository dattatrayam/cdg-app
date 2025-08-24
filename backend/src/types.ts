export type Role = 'user' | 'ai';

export interface ChatMessage {
  role: Role;
  content: string;
  ts: number;
}

export type ChartType = 'line' | 'bar' | 'pie';

export interface ChartPayload {
  title: string;
  type: ChartType;
  data: any[];
  xKey?: string;
  yKey?: string;
}

/**
 * Represents a dashboard session with chat + chart state
 */
export interface ChatSession {
  dashboardId: string;
  dataSourceId?: string;  // <-- NEW: selected dataset
  messages: ChatMessage[];
  lastChart?: ChartPayload;
  updatedAt: number;
}

/**
 * Represents a data source (open dataset or custom)
 */
export interface DataSource {
  id: string;
  name: string;
  description?: string;
  schema?: any; // could hold column metadata if available
  sampleQuery?: string; // optional default query example
}
