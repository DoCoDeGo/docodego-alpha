/** Thin fs layer — the only module that touches node:fs directly. */
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";

export const readText = (p: string): string | null => {
  try {
    return readFileSync(p, "utf8");
  } catch {
    return null;
  }
};

export const exists = (p: string): boolean => existsSync(p);

export const isDir = (p: string): boolean => {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
};

export const isFile = (p: string): boolean => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};

export function listDirs(p: string): string[] {
  try {
    return readdirSync(p)
      .filter((e: string) => isDir(join(p, e)))
      .sort();
  } catch {
    return [];
  }
}

export function listFiles(p: string): string[] {
  try {
    return readdirSync(p)
      .filter((e: string) => isFile(join(p, e)))
      .sort();
  } catch {
    return [];
  }
}

export const ensureDir = (p: string): void => {
  mkdirSync(p, { recursive: true });
};

export const writeText = (p: string, s: string): void => {
  ensureDir(dirname(p));
  writeFileSync(p, s);
};

export const appendText = (p: string, s: string): void => {
  ensureDir(dirname(p));
  appendFileSync(p, s);
};

/** Recursive file walk; `skip` prunes directory names, `cap` bounds the walk. */
export function walkFiles(root: string, skip: Set<string>, cap = 2000): string[] {
  const out: string[] = [];
  const visit = (dir: string): void => {
    if (out.length >= cap) return;
    let entries: string[] = [];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const e of entries.sort()) {
      const p = join(dir, e);
      let isDirectory = false;
      try {
        isDirectory = statSync(p).isDirectory();
      } catch {
        continue;
      }
      if (isDirectory) {
        if (!skip.has(e)) visit(p);
      } else {
        out.push(p);
      }
      if (out.length >= cap) return;
    }
  };
  visit(root);
  return out;
}

/** The writer's wall-clock date — the one calendar the record keeps
 * (ruled 2026-11-08 after the two-calendars defect: gate rows stamped in
 * UTC, the human's rows local, two calendars in one record). Local
 * getters, zero-padded YYYY-MM-DD. */
export const today = (): string => {
  const d = new Date();
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** The 16-hex binding hash: score.md blocks carry the spec's sha at scoring
 * time, and the delivery gate recomputes it — a spec edited after scoring
 * fails the gate as stale instead of landing on a borrowed verdict. */
export const sha16 = (text: string): string => createHash("sha256").update(text).digest("hex").slice(0, 16);
