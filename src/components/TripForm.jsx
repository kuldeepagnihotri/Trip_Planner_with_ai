import { useState } from 'react'

const EXAMPLES = [
  'I want to visit Goa for 5 days with friends under ₹30,000.',
  '3 days in Manali, budget-friendly, solo trip, love trekking and cafes.',
  '7 day family trip to Jaipur and Udaipur, mid-range budget, kid-friendly.',
]

export default function TripForm({ onSubmit, isLoading }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim() || isLoading) return
    onSubmit(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-3xl p-5 sm:p-6 shadow-xl shadow-brand-500/5">
      <label htmlFor="trip-input" className="sr-only">
        Describe your trip
      </label>
      <textarea
        id="trip-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={500}
        rows={3}
        placeholder="E.g., 5 day trip to Goa with friends, ₹30,000 budget, love beaches and nightlife…"
        className="w-full resize-none bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base sm:text-lg"
      />
      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
        <span className="text-xs text-slate-400">{value.length} / 500</span>
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="px-5 py-2.5 rounded-full bg-brand-600 text-white font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-700 active:scale-95 transition"
        >
          {isLoading ? 'Planning…' : 'Plan My Trip'}
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-white/10">
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Quick start</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setValue(ex)}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition text-left"
            >
              {ex.length > 42 ? ex.slice(0, 42) + '…' : ex}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}
