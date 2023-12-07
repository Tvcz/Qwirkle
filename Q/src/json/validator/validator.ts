/**
 * Ensures the given string is valid JSON.
 * @param json the json string to ensure is valid
 * @returns the parsed JSON object
 * @throws an error if the given string is not valid JSON
 */
export function validateJSON(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    throw new Error('could not parse JSON');
  }
}

/**
 * Checks if the given string is valid JSON.
 * @param json the json string to check
 * @returns true if the given string is valid JSON, false otherwise
 */
export function isValidJSON(json: string): boolean {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}
