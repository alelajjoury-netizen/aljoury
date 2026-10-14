import mongoose from 'mongoose';
import { connectDB } from '../lib/db';

function safeDiagnostics(error: unknown) {
  const details: string[] = [];
  const visited = new Set<unknown>();

  function inspect(value: unknown, depth = 0) {
    if (!value || typeof value !== 'object' || depth > 5 || visited.has(value)) return;
    visited.add(value);
    const record = value as Record<string, unknown>;
    const name = typeof record.name === 'string' ? record.name : '';
    const code =
      typeof record.code === 'number' || typeof record.code === 'string'
        ? String(record.code)
        : '';
    const codeName =
      typeof record.codeName === 'string' &&
      /^[A-Za-z0-9_-]{1,40}$/.test(record.codeName)
        ? record.codeName
        : '';
    if (name || code || codeName) {
      details.push([name, codeName, code].filter(Boolean).join(':'));
    }

    inspect(record.cause, depth + 1);
    inspect(record.reason, depth + 1);

    const servers = record.servers;
    if (servers instanceof Map) {
      for (const server of servers.values()) {
        if (server && typeof server === 'object') {
          inspect((server as Record<string, unknown>).error, depth + 1);
        }
      }
    }
  }

  inspect(error);
  return [...new Set(details)].slice(0, 8);
}

try {
  await connectDB();
  console.info('MongoDB Atlas connection succeeded.');
} catch (error) {
  console.error(
    'MongoDB Atlas connection failed. Safe diagnostic types:',
    JSON.stringify(safeDiagnostics(error)),
  );
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
