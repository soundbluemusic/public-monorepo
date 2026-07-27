export function logD1Error(operation: string, error: unknown): void {
  console.error(`[D1] ${operation} failed:`, error instanceof Error ? error.message : error);
}
