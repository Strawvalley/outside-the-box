function getTimestamp(): string {
  return new Date().toISOString();
}

export function logInfo(message: string): void {
  if (process.env.NODE_ENV === 'production') return;
  console.log(`${getTimestamp()} - [INFO] - ${message}`);
}

export function logDebug(message: string): void {
  if (process.env.NODE_ENV === 'production') return;
  console.debug(`${getTimestamp()} - [DEBUG] - ${message}`);
}

export function logWarning(message: string): void {
  if (process.env.NODE_ENV === 'production') return;
  console.warn(`${getTimestamp()} - [WARNING] - ${message}`);
}
