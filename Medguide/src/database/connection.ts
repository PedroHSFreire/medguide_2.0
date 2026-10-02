import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath =
  process.env.DATABASE_PATH || path.join(__dirname, "../../database.sqlite");

let resolveConnectionReady!: () => void;
let rejectConnectionReady!: (error: Error) => void;

export const connectionReady = new Promise<void>((resolve, reject) => {
  resolveConnectionReady = resolve;
  rejectConnectionReady = reject;
});

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    rejectConnectionReady(err);
    return;
  }

  db.run("PRAGMA foreign_keys = ON", (pragmaError) => {
    if (pragmaError) {
      rejectConnectionReady(pragmaError);
      return;
    }

    resolveConnectionReady();
  });
});

export const closeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const runQuery = (
  sql: string,
  params: unknown[] = []
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const getQuery = <T>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as T);
      }
    });
  });
};

export const allQuery = <T>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as T[]);
      }
    });
  });
};
