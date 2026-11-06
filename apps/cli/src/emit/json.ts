/** Emission: JSON envelopes for `--json` read commands. Human rendering lives
 * in diagnostics.ts; the status board in board.ts. */
import type { Diagnostic } from "../types.ts";

export interface JsonEnvelope {
  schema: string;
  ok: boolean;
  data?: unknown;
  error?: { code: string; message: string };
  diagnostics?: Diagnostic[];
}

export const envelope = (cmd: string, data: unknown, ok = true): JsonEnvelope => ({
  schema: `docodego/${cmd}/v1`,
  ok,
  data,
});

export const errorEnvelope = (cmd: string, code: string, message: string, diagnostics: Diagnostic[] = []): JsonEnvelope => ({
  schema: `docodego/${cmd}/v1`,
  ok: false,
  error: { code, message },
  diagnostics,
});
