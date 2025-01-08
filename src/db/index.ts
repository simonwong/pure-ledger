import Database from '@tauri-apps/plugin-sql';
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema from './schema';

const sqliteDB = await Database.load('sqlite:ledger.db');
// const sqliteDB = await Database.load('sqlite:test.db');

// 参考：https://github.com/tdwesten/tauri-drizzle-sqlite-proxy-demo/blob/main/src/db/database.ts

export const db = drizzle(
  async (sql, params, method) => {
    try {
      if (sql.startsWith('select')) {
        const selectRes = await sqliteDB.select<unknown[]>(sql, params).catch((e) => {
          console.error(e);
          return [];
        });
        const rowsData = selectRes.map((row: any) => {
          return Object.values(row);
        });

        return {
          rows: method === 'all' ? rowsData : rowsData[0],
        };
      }
      const res = await sqliteDB.execute(sql, params);
      return { rows: [], ...res };
    } catch (e) {
      console.error('Error from sqlite: ', e instanceof Error ? e.message : e, sql, params, method);
      return { rows: [] };
    }
  },
  {
    schema,
  }
);
