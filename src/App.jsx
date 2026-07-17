import { useRef } from 'react'
import { useTripPlanner } from './hooks/useTripPlanner.js'
import TripForm from './components/TripForm.jsx'
import TripResult from './components/TripResult.jsx'
import LoadingSkeleton from './components/LoadingSkeleton.jsx'
import ErrorState from './components/ErrorState.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

export default function App() {
  const { status, error, trip, modelUsed, planTrip, modifyTrip, reset } = useTripPlanner()
  const lastInputRef = useRef('')

  const handlePlan = (text) => {
    lastInputRef.current = text
    planTrip(text).catch(() => {})
  }

  const handleRetry = () => {
    if (lastInputRef.current) planTrip(lastInputRef.current).catch(() => {})
  }

  const handleModify = (instruction) => {
    modifyTrip(instruction).catch(() => {})
  }

  const hasTrip = Boolean(trip)

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_-10%,rgba(124,92,255,0.18),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(124,92,255,0.12),transparent_40%)]"
      />

      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-brand-600 dark:text-brand-300">
            AI Trip Planner
          </h1>
          <p className="text-xs text-slate-400 tracking-wide uppercase">Internship assignment</p>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-8">
        {!hasTrip && (
          <>
            <TripForm onSubmit={handlePlan} isLoading={status === 'loading'} />

            {status === 'idle' && (
              <div className="text-center py-10">
                <div className="text-5xl mb-3" aria-hidden="true">
                  🧭
                </div>
                <h2 className="font-display text-xl font-semibold">Where would you like to go?</h2>
                <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                  Describe your trip in plain language and get a full AI-generated itinerary.
                </p>
              </div>
            )}

            {status === 'loading' && <LoadingSkeleton />}
            {status === 'error' && <ErrorState error={error} onRetry={handleRetry} />}
          </>
        )}

        {hasTrip && status === 'error' && (
          <div
            role="alert"
            className="glass rounded-2xl p-4 text-sm text-center border-red-300/50 text-red-500"
          >
            Couldn't apply that change ({error?.message || 'unknown error'}). Your previous plan is still shown below — try rephrasing the request.
          </div>
        )}

        {hasTrip && (
          <TripResult
            trip={trip}
            modelUsed={modelUsed}
            onModify={handleModify}
            isModifying={status === 'loading'}
            onReset={reset}
          />
        )}
      </main>

      <footer className="text-center text-xs text-slate-400 pb-8">
        Built with React, Vite &amp; Tailwind · Powered by free OpenRouter models
      </footer>
    </div>
  )
}
