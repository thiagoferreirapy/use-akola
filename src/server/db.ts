import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Db } from './types';

const databasePath = path.join(process.cwd(), 'data', 'akola.json');
const emptyDb: Db = { users: [], places: [], confirmations: [], reviews: [], favorites: [], claims: [], offers: [], visits: [], redemptions: [], reports: [] };

export async function readDb(): Promise<Db> {
  try { return JSON.parse(await fs.readFile(databasePath, 'utf8')) as Db; }
  catch { await fs.mkdir(path.dirname(databasePath), { recursive: true }); await fs.writeFile(databasePath, JSON.stringify(emptyDb, null, 2)); return structuredClone(emptyDb); }
}

export async function writeDb(db: Db) {
  await fs.mkdir(path.dirname(databasePath), { recursive: true });
  const temporaryPath = `${databasePath}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(db, null, 2));
  await fs.rename(temporaryPath, databasePath);
}

export const createId = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;
