export function logInfo(message: string) {
  console.log(`${getTimestamp()} - [INFO] - ${message}`);
}

export function logDebug(message: string) {
  console.log(`${getTimestamp()} - [DEBUG] - ${message}`);
}

export function logWarning(message: string) {
  console.log(`${getTimestamp()} - [WARNING] - ${message}`);
}

function getTimestamp() {
  return new Date().toISOString();
}