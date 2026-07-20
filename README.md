# AI Trip Planner

A small React app that turns a free-form trip description into a full,
structured, interactive itinerary using a free OpenRouter LLM.


## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and add your OpenRouter key:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-...
   ```
   Get a free key at https://openrouter.ai/keys — no card required for the
   `:free` models used here.
3. `npm run dev` (or `npm start`) → open the printed local URL.

## How it works

- User types a trip description (`TripForm`).
- `useTripPlanner` hook sends it to `services/openrouter.js`, which calls
  OpenRouter's chat completions endpoint directly from the browser (per
  assignment instructions — see "Known limitations" below).
- The model is instructed (via `services/prompts.js`) to return **only
  JSON** matching a fixed trip shape.
- The raw response is parsed (`extractJson`, which also strips markdown
  fences small models sometimes add) and validated with **Zod**
  (`utils/tripSchema.js`).
- If parsing or validation fails, the request is retried automatically
  (up to 2 extra attempts), falling back through three free models in
  order: `google/gemma-3-27b-it:free` → `meta-llama/llama-3.3-70b-instruct:free`
  → `deepseek/deepseek-r1-0528:free`.
- On success the trip renders as an interactive UI: expandable day cards,
  a budget breakdown, packing list, and a "modify" box that lets you ask
  for changes ("cheaper hotel", "add more adventure") — this re-sends the
  current trip JSON plus your instruction and replaces the plan with the
  model's updated JSON.
- A request-id ref guards against a slow, stale response overwriting a
  newer one if you submit twice quickly.

## Folder structure

```
src/
  components/    TripForm, TripResult, DayCard, LoadingSkeleton, ErrorState, ThemeToggle
  context/       ThemeContext (dark/light mode)
  hooks/         useTripPlanner (loading/error/retry/state machine)
  services/      openrouter.js (API calls + model fallback), prompts.js (prompt templates)
  utils/         tripSchema.js (Zod schema + validateTrip)
```

## AI-usage note

I used Claude to help scaffold this project: generating the initial
component structure, the Zod schema, and the retry/fallback logic in
`useTripPlanner`/`openrouter.js`, then reviewed and adjusted it myself
(prompt wording, state flow for the modify feature, styling). I
understand and can walk through every file.

## Known limitations

- **API key is exposed in the browser.** The assignment explicitly asked
  for a frontend-only app with the key read via
  `import.meta.env.VITE_OPENROUTER_API_KEY`. In a real production app
  this call should go through a small backend/serverless proxy instead,
  so the key never ships to the client.
- Free OpenRouter models are less consistent at strict JSON output than
  paid ones; the extract-and-retry logic handles most cases but very
  malformed output can still exhaust all retries (shown as an error
  state with a "Try again" button).
- No streaming — the full JSON is awaited before rendering (a stretch
  goal I didn't get to).
- No persistence — refreshing the page loses the current trip.
- Cost estimates are the model's best guess, not real pricing data.

## Time spent

~8 hours (core build + styling + failure handling).
