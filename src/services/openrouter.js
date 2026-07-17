const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export const FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'openai/gpt-oss-120b:free',
  'qwen/qwen3-coder:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'openrouter/free',
]

function getApiKey() {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!key) {
    throw new Error(
      'Missing VITE_OPENROUTER_API_KEY. Add it to a .env file at the project root (see .env.example).'
    )
  }
  return key
}

export function extractJson(raw) {
  let text = raw.trim()
  text = text.replace(/^```(json)?/i, '').replace(/```$/, '').trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) {
    throw new Error('No JSON object found in model response')
  }
  const candidate = text.slice(start, end + 1)
  return JSON.parse(candidate)
}

async function callModel(model, messages, { signal } = {}) {
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Trip Planner',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
    signal,
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`OpenRouter error ${res.status} (${model}): ${body.slice(0, 200)}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) throw new Error(`Empty response from ${model}`)
  return content
}

export async function chatJson(messages, { signal, models = FREE_MODELS } = {}) {
  let lastError
  for (const model of models) {
    try {
      const raw = await callModel(model, messages, { signal })
      const json = extractJson(raw)
      return { json, modelUsed: model }
    } catch (err) {
      lastError = err
    }
  }
  throw lastError || new Error('All free models failed')
}
