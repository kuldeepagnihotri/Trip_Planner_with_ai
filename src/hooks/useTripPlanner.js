import { useCallback, useRef, useState } from 'react'
import { chatJson } from '../services/openrouter.js'
import { SYSTEM_PROMPT, buildPlannerPrompt, buildModifyPrompt } from '../services/prompts.js'
import { validateTrip } from '../utils/tripSchema.js'

const MAX_RETRIES = 2

export function useTripPlanner() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [trip, setTrip] = useState(null)
  const [modelUsed, setModelUsed] = useState(null)

  const requestIdRef = useRef(0)
  const abortRef = useRef(null)

  const runRequest = useCallback(async (messages) => {
    const myRequestId = ++requestIdRef.current
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus('loading')
    setError(null)

    let lastIssue = null

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { json, modelUsed: usedModel } = await chatJson(messages, { signal: controller.signal })
        const validation = validateTrip(json)

        if (requestIdRef.current !== myRequestId) return

        if (validation.success) {
          setTrip(validation.data)
          setModelUsed(usedModel)
          setStatus('success')
          return validation.data
        }
        lastIssue = new Error('Model returned JSON that did not match the expected trip shape.')
      } catch (err) {
        if (err.name === 'AbortError') return
        lastIssue = err
      }
    }

    if (requestIdRef.current !== myRequestId) return
    setError(lastIssue)
    setStatus('error')
    throw lastIssue
  }, [])

  const planTrip = useCallback(
    (userInput) => {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildPlannerPrompt(userInput) },
      ]
      return runRequest(messages)
    },
    [runRequest]
  )

  const modifyTrip = useCallback(
    (instruction) => {
      if (!trip) return
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildModifyPrompt(trip, instruction) },
      ]
      return runRequest(messages)
    },
    [trip, runRequest]
  )

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setStatus('idle')
    setError(null)
    setTrip(null)
    setModelUsed(null)
  }, [])

  return { status, error, trip, modelUsed, planTrip, modifyTrip, reset }
}
