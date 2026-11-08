/** Emission: JSON envelopes for `--json` read commands. Human rendering lives
 * in diagnostics.ts; the status board in board.ts. */
import type { Io } from "../types.ts";
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

/** The one pour: every command's `--json` output goes through here, so the
 * envelope shape and its pretty-print are defined once. */
export const emitJson = (io: Io, cmd: string, data: unknown, ok = true): void => {
  io.out(JSON.stringify(envelope(cmd, data, ok), null, 2));
};

/** The error-path pour: refusal envelopes ride stderr with ok: false. */
export const emitJsonErr = (io: Io, cmd: string, data: unknown): void => {
  io.err(JSON.stringify(envelope(cmd, data, false), null, 2));
};
