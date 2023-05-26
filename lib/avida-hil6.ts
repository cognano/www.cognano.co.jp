import {
  FetchDatabase,
  QueryDatabaseParameters,
  QueryDatabaseResponseEx,
} from 'notionate'

export const GetMomLibs = async (): Promise<QueryDatabaseResponseEx> => {
  const q = {
      database_id: process.env.NOTION_MOTHERLIBRARIES_DB_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        },
      ]
  } as QueryDatabaseParameters
  return await FetchDatabase(q)
}

export const GetSubLibs = async (): Promise<QueryDatabaseResponseEx> => {
  const q = {
      database_id: process.env.NOTION_SUBLIBRARIES_DB_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        },
      ]
  } as QueryDatabaseParameters
  return await FetchDatabase(q)
}