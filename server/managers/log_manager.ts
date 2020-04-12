function getTimestamp(): string {
  return new Date().toISOString();
}

export function logInfo(message: string): void {
  console.log(`${getTimestamp()} - [INFO] - ${message}`);
}

export function logDebug(message: string): void  {
  console.log(`${getTimestamp()} - [DEBUG] - ${message}`);
}

export function logWarning(message: string): void  {
  console.log(`${getTimestamp()} - [WARNING] - ${message}`);
}
