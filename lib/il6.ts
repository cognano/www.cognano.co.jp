import {
  FetchDatabase,
  QueryDatabaseParameters,
  QueryDatabaseResponseEx,
} from 'notionate'

const motherlibrariesQuery = {
    database_id: process.env.NOTION_MOTHERLIBRARIES_DB_ID,
    sorts: [
      {
        property: 'Name',
        direction: 'ascending'
      },
    ]
} as QueryDatabaseParameters

export const GetMomLibs = async (): Promise<QueryDatabaseResponseEx> => {
  return await FetchDatabase(motherlibrariesQuery)
}

const sublibrariesQuery = {
    database_id: process.env.NOTION_SUBLIBRARIES_DB_ID,
    sorts: [
      {
        property: 'Name',
        direction: 'ascending'
      },
    ]
} as QueryDatabaseParameters

export const GetSubLibs = async (): Promise<QueryDatabaseResponseEx> => {
  return await FetchDatabase(sublibrariesQuery)
}