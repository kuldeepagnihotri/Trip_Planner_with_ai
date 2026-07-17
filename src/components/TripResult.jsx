import { useState } from 'react'
import DayCard from './DayCard.jsx'

export default function TripResult({ trip, modelUsed, onModify, isModifying, onReset }) {
  const [modifyText, setModifyText] = useState('')
  const costs = trip.estimatedCosts || {}
  const costEntries = Object.entries(costs).filter(([, v]) => v > 0)
  const maxCost = Math.max(1, ...costEntries.map(([, v]) => v))

  const handleModifySubmit = (e) => {
    e.preventDefault()
    if (!modifyText.trim() || isModifying) return
    onModify(modifyText.trim())
    setModifyText('')
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-300 font-medium">
              {trip.destination}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">{trip.tripName}</h2>
          </div>
          <button
            onClick={onReset}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 hover:border-brand-400 transition"
          >
            Plan a new trip
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{trip.overview}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <Stat label="Duration" value={`${trip.durationDays} days`} />
          <Stat label="Budget" value={`${trip.currency} ${trip.budgetTotal?.toLocaleString()}`} />
          <Stat label="Best time" value={trip.bestTimeToVisit || '—'} />
          <Stat label="Model used" value={modelUsed?.split('/')[1]?.replace(':free', '') || '—'} />
        </div>
      </div>

      {costEntries.length > 0 && (
        <div className="glass rounded-3xl p-6 sm:p-8">
          <h3 className="font-display font-semibold mb-4">Estimated budget breakdown</h3>
          <div className="space-y-3">
            {costEntries.map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-slate-600 dark:text-slate-300">{key}</span>
                  <span className="text-slate-400">
                    {trip.currency} {value.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200/70 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-300 rounded-full transition-all duration-500"
                    style={{ width: `${(value / maxCost) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-display font-semibold mb-4 px-1">Day-by-day itinerary</h3>
        <div className="space-y-4">
          {trip.days.map((day) => (
            <DayCard key={day.day} day={day} currency={trip.currency} />
          ))}
        </div>
      </div>

      {(trip.packingList?.length > 0 || trip.travelTips?.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {trip.packingList?.length > 0 && (
            <ListCard title="🎒 Packing list" items={trip.packingList} />
          )}
          {trip.travelTips?.length > 0 && (
            <ListCard title="💡 Travel tips" items={trip.travelTips} />
          )}
        </div>
      )}

      <form onSubmit={handleModifySubmit} className="glass rounded-3xl p-5 sm:p-6">
        <label htmlFor="modify-input" className="text-sm font-medium block mb-2">
          Want changes? Ask the AI to adjust this plan.
        </label>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <input
            id="modify-input"
            value={modifyText}
            onChange={(e) => setModifyText(e.target.value)}
            placeholder="E.g., cheaper hotel, add more adventure, remove museums…"
            className="flex-1 min-w-[200px] bg-white/60 dark:bg-white/5 rounded-full px-4 py-2.5 text-sm outline-none border border-slate-200 dark:border-white/10 focus:border-brand-400"
          />
          <button
            type="submit"
            disabled={!modifyText.trim() || isModifying}
            className="px-5 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-brand-700 active:scale-95 transition shrink-0"
          >
            {isModifying ? 'Updating…' : 'Update trip'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white/60 dark:bg-white/5 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm font-medium mt-0.5 truncate">{value}</p>
    </div>
  )
}

function ListCard({ title, items }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h4 className="font-medium mb-3">{title}</h4>
      <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-brand-500">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
