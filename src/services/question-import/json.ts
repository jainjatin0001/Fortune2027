export function getStringRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(asString).filter(Boolean);
}

export function parseStrictJsonObject(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    throw new Error('LLM response was not a strict JSON object.');
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    const record = getStringRecord(parsed);
    if (!record) throw new Error('JSON root must be an object.');
    return record;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Malformed JSON: ${error.message}`);
    }
    throw new Error('Malformed JSON.');
  }
}

export function recordToStringMap(record: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = key.trim();
    const normalizedValue = asString(value);
    if (normalizedKey && normalizedValue) out[normalizedKey] = normalizedValue;
  }
  return out;
}
