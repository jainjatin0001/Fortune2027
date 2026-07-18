const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_TAGS_URL = 'http://localhost:11434/api/tags';
const OLLAMA_MODEL = 'qwen3:8b';
const OLLAMA_TIMEOUT_MS = parsePositiveInteger(process.env.OLLAMA_TIMEOUT_MS, 900_000);

interface OllamaGenerateResponse {
  response?: string;
  done?: boolean;
  error?: string;
}

interface OllamaTagsResponse {
  models?: Array<{ name?: string; model?: string }>;
}

export async function assertOllamaReady(): Promise<void> {
  let response: Response;
  try {
    response = await fetch(OLLAMA_TAGS_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new Error(`Ollama is not reachable at http://localhost:11434. Start Ollama and make sure qwen3:8b is installed. ${formatFetchCause(error)}`);
  }

  if (!response.ok) {
    throw new Error(`Ollama health check failed with ${response.status}. Start Ollama and make sure qwen3:8b is installed.`);
  }

  const data = await response.json() as OllamaTagsResponse;
  const models = data.models ?? [];
  const hasModel = models.some((model) => model.name === OLLAMA_MODEL || model.model === OLLAMA_MODEL);
  if (!hasModel) {
    throw new Error('Ollama is running, but qwen3:8b is not installed. Run `ollama pull qwen3:8b` and retry.');
  }
}

export async function generateStrictJson(prompt: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(OLLAMA_TIMEOUT_MS),
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0,
          top_p: 0.1,
          num_ctx: 8192,
        },
      }),
    });
  console.log("Prompt length:", prompt.length);
  } catch (error) {
    throw new Error(`Ollama request failed. Confirm Ollama is running at http://localhost:11434 and qwen3:8b is available. ${formatFetchCause(error)}`);
  }

  if (!response.ok) {
    throw new Error(`Ollama request failed with ${response.status}. Ensure qwen3:8b is running locally.`);
  }

  const data = await response.json() as OllamaGenerateResponse;
  if (data.error) throw new Error(data.error);
  if (!data.response) throw new Error('Ollama returned an empty response.');
  return data.response;
}

export function getOllamaTimeoutMs(): number {
  return OLLAMA_TIMEOUT_MS;
}

export function isOllamaTimeoutError(error: unknown): boolean {
  return error instanceof Error && /timed out|timeout/i.test(error.message);
}

function formatFetchCause(error: unknown): string {
  if (error instanceof Error && error.name === 'TimeoutError') {
    return `The request timed out after ${Math.round(OLLAMA_TIMEOUT_MS / 1000)} seconds.`;
  }
  if (error instanceof Error && error.message) {
    return `Cause: ${error.message}`;
  }
  return '';
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
