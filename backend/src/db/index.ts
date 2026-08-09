import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

const databasePath = process.env.DATABASE_URL || './data/interview.db';
const resolvedPath = path.isAbsolute(databasePath) ? databasePath : path.resolve(process.cwd(), databasePath);

mkdirSync(path.dirname(resolvedPath), { recursive: true });

let dbInstance: Database.Database | null = null;
let drizzleDb: ReturnType<typeof drizzle> | null = null;

export function getDatabasePath() {
  return resolvedPath;
}

function applyMigrations() {
  const migrationPath = path.resolve(process.cwd(), 'drizzle/0000_breezy_war_machine.sql');
  if (!dbInstance) {
    return;
  }

  if (!existsSync(migrationPath)) {
    return;
  }

  const sql = readFileSync(migrationPath, 'utf8');
  if (!sql.trim()) {
    return;
  }

  dbInstance.exec(sql);
}

export function initializeDatabase() {
  if (dbInstance) {
    return drizzleDb;
  }

  try {
    dbInstance = new Database(resolvedPath);
    dbInstance.pragma('journal_mode = WAL');
    drizzleDb = drizzle(dbInstance, { schema });
    applyMigrations();
    return drizzleDb;
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.warn(`[Database] SQLite native module unavailable: ${err?.message ?? err}. Falling back to JSON file storage.`);
    return null;
  }
}

export function getDb() {
  return initializeDatabase();
}

export function closeDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    drizzleDb = null;
  }
}
