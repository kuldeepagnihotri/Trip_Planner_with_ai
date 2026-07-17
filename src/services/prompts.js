export const SYSTEM_PROMPT = `You are an expert travel planner AI.
You MUST respond with ONLY valid JSON — no markdown fences, no commentary,
no leading or trailing text of any kind. The very first character of your
response must be "{" and the very last must be "}".

If the user's request is missing details (dates, exact budget, etc.), make
reasonable assumptions and proceed — never ask a follow-up question, since
your output is parsed by code with no human in the loop.`

export const TRIP_JSON_SHAPE = `{
  "tripName": string,
  "destination": string,
  "durationDays": number,
  "budgetTotal": number,
  "currency": string,
  "bestTimeToVisit": string,
  "overview": string,
  "packingList": string[],
  "travelTips": string[],
  "days": [
    {
      "day": number,
      "title": string,
      "morning": string,
      "afternoon": string,
      "evening": string,
      "night": string,
      "estimatedCost": number
    }
  ],
  "estimatedCosts": {
    "transport": number,
    "hotel": number,
    "food": number,
    "activities": number,
    "misc": number
  }
}`

export function buildPlannerPrompt(userInput) {
  return `Create a complete, realistic trip itinerary based on this request from the user:

"${userInput}"

Return ONLY a JSON object matching exactly this shape (fill in real values, do not leave placeholders):
${TRIP_JSON_SHAPE}

Rules:
- "days" must have exactly durationDays entries, numbered 1..durationDays.
- All costs are numbers in the destination's local currency (set "currency" accordingly), no currency symbols.
- estimatedCosts values should roughly sum to budgetTotal.
- Keep each itinerary field (morning/afternoon/evening/night) to 1-2 concise sentences.
- Do not wrap the JSON in markdown code fences.`
}

export function buildModifyPrompt(previousTripJson, instruction) {
  return `Here is the current trip plan as JSON:
${JSON.stringify(previousTripJson)}

The user wants this change: "${instruction}"

Apply the change and return the FULL updated trip as a JSON object in exactly
the same shape as the original (same keys). Do not omit any fields. Return
ONLY the JSON object, no commentary, no markdown fences.`
}
