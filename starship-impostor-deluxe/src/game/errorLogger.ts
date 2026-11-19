import type { ErrorLogEntry } from "./types";

const STORAGE_KEY = "starship_error_logs_v1";
const MAX_LOGS = 200;

type Listener = (logs: ErrorLogEntry[]) => void;

class PersistentErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private listeners = new Set<Listener>();
  private initialized = false;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      if (typeof localStorage === "undefined") return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.logs = parsed.slice(0, MAX_LOGS);
      }
    } catch {
      this.logs = [];
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs.slice(0, MAX_LOGS)));
    } catch {
      // Ignore quota failures
    }
  }

  private emit(): void {
    const snap = this.getLogs();
    this.listeners.forEach((fn) => {
      try {
        fn(snap);
      } catch {
        // Ignore subscriber error
      }
    });
  }

  public installGlobalHandlers(): void {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;

    window.addEventListener("error", (ev: ErrorEvent) => {
      this.log({
        source: ev.filename ? `${ev.filename}:${ev.lineno}:${ev.colno}` : "window.onerror",
        severity: "ERROR",
        message: ev.message || "Uncaught runtime error",
        stack: ev.error instanceof Error ? ev.error.stack : undefined,
      });
    });

    window.addEventListener("unhandledrejection", (ev: PromiseRejectionEvent) => {
      const reason = ev.reason;
      this.log({
        source: "unhandledrejection",
        severity: "ERROR",
        message: reason instanceof Error ? reason.message : String(reason ?? "Unhandled Promise rejection"),
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    });
  }

  public log(entry: Omit<ErrorLogEntry, "id" | "timestamp">): ErrorLogEntry {
    const record: ErrorLogEntry = {
      id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      source: entry.source || "app",
      severity: entry.severity || "ERROR",
      message: String(entry.message || "Unknown error").slice(0, 500),
      stack: entry.stack ? String(entry.stack).slice(0, 1400) : undefined,
      context: entry.context ? String(entry.context).slice(0, 300) : undefined,
    };

    // Deduplicate identical consecutive noise within 1500ms
    const latest = this.logs[0];
    if (
      latest &&
      latest.message === record.message &&
      latest.source === record.source &&
      Math.abs(Date.parse(latest.timestamp) - Date.parse(record.timestamp)) < 1500
    ) {
      return latest;
    }

    this.logs = [record, ...this.logs].slice(0, MAX_LOGS);
    this.saveToStorage();
    this.emit();
    return record;
  }

  public getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.saveToStorage();
    this.emit();
  }

  public exportLogsText(): string {
    if (this.logs.length === 0) return "[STARSHIP IMPOSTOR DELUXE] No recorded errors.";
    return this.logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.severity}] (${l.source}) ${l.message}${
            l.context ? `\n  context: ${l.context}` : ""
          }${l.stack ? `\n  stack: ${l.stack}` : ""}`
      )
      .join("\n\n");
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getLogs());
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const ErrorLogger = new PersistentErrorLogger();

export function logGameError(
  source: string,
  err: unknown,
  severity: "ERROR" | "WARN" | "NETWORK" = "ERROR",
  context?: string
): void {
  const message = err instanceof Error ? err.message : String(err ?? "Unknown error");
  const stack = err instanceof Error ? err.stack : undefined;
  ErrorLogger.log({ source, severity, message, stack, context });
}
