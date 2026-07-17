import { useState } from 'react'

const SLOTS = [
  { key: 'morning', label: 'Morning', icon: '🌅' },
  { key: 'afternoon', label: 'Afternoon', icon: '☀️' },
  { key: 'evening', label: 'Evening', icon: '🌇' },
  { key: 'night', label: 'Night', icon: '🌙' },
]

export default function DayCard({ day, currency }) {
  const [open, setOpen] = useState(day.day === 1)

  return (
    <div className="relative pl-8 sm:pl-10">
      <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-brand-600 text-white text-xs grid place-items-center font-semibold">
        {day.day}
      </span>
      <span className="absolute left-[11px] top-7 bottom-[-1rem] w-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />

      <div className="glass rounded-2xl overflow-hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 text-left"
        >
          <div>
            <p className="text-xs text-brand-600 dark:text-brand-300 font-medium">Day {day.day}</p>
            <h3 className="font-display font-semibold">{day.title || `Day ${day.day}`}</h3>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {day.estimatedCost ? (
              <span className="text-xs text-slate-400">
                ~{currency} {day.estimatedCost.toLocaleString()}
              </span>
            ) : null}
            <span className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
              ▾
            </span>
          </div>
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-5 grid sm:grid-cols-2 gap-3">
              {SLOTS.map((slot) => (
                <div key={slot.key} className="rounded-xl bg-white/60 dark:bg-white/5 p-3">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {slot.icon} {slot.label}
                  </p>
                  <p className="text-sm">{day[slot.key] || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
