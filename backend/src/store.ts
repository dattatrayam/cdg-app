import { ChatSession } from './types';

const sessions = new Map<string, ChatSession>();

const dataSources = [
  {
    id: 'shakespeare',
    name: 'Shakespeare Text',
    description: 'Word counts from Shakespeare works',
    projectId: 'bigquery-public-data',
    dataset: 'samples',
    table: 'shakespeare',
  },
  {
    id: 'covid',
    name: 'COVID-19 Open Data',
    description: 'Worldwide COVID-19 cases and stats',
    projectId: 'bigquery-public-data',
    dataset: 'covid19_open_data',
    table: 'covid19_open_data',
  },
  {
    id: 'citibike',
    name: 'NYC CitiBike Trips',
    description: 'Bike trip records in New York City',
    projectId: 'bigquery-public-data',
    dataset: 'new_york_citibike',
    table: 'citibike_trips',
  },
];


export const store = {
  createSession(id: string, dataSourceId: string): ChatSession {
    const session: ChatSession = { dashboardId: id, dataSourceId, messages: [], updatedAt: Date.now() };
    sessions.set(id, session);
    return session;
  },
  getSession(id: string): ChatSession | undefined {
    return sessions.get(id);
  },
  upsertSession(session: ChatSession) {
    session.updatedAt = Date.now();
    sessions.set(session.dashboardId, session);
  },
  listRecent(limit = 10) {
    return Array.from(sessions.values())
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit)
      .map(s => ({
        dashboardId: s.dashboardId,
        lastMessage: s.messages.length > 0 ? s.messages[s.messages.length - 1].content : '',
        updatedAt: s.updatedAt
      }));
  },
   listDataSources() {
    return dataSources;
  },
  
  getSessionCount() {
    return sessions?.size;
  },

  getDataSource(id: string) {
    return dataSources.find(ds => ds.id === id);
  },
};
