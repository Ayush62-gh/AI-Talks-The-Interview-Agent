import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

function getResolvedDatabasePath(): string {
  const isVercel = Boolean(process.env.VERCEL);
  const rawPath = process.env.DATABASE_URL;
  if (isVercel && (!rawPath || !path.isAbsolute(rawPath) || rawPath.includes('data'))) {
    return '/tmp/interview.db';
  }
  const targetPath = rawPath || './data/interview.db';
  return path.isAbsolute(targetPath) ? targetPath : path.resolve(process.cwd(), targetPath);
}

let dbInstance: Database.Database | null = null;
let drizzleDb: ReturnType<typeof drizzle> | null = null;

export function getDatabasePath() {
  return getResolvedDatabasePath();
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
    const resolvedPath = getResolvedDatabasePath();
    try {
      mkdirSync(path.dirname(resolvedPath), { recursive: true });
    } catch {
      // Ignore directory creation failure if path exists or system is read-only
    }

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
