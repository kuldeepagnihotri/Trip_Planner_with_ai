export default function LoadingSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Generating your trip plan">
      <div className="skeleton h-8 w-2/3" />
      <div className="skeleton h-4 w-1/3" />
      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24" />
        ))}
      </div>
      <div className="space-y-3 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-20" />
        ))}
      </div>
      <span className="sr-only">Generating your trip plan…</span>
    </div>
  )
}
