export default function ErrorState({ error, onRetry }) {
  return (
    <div className="glass rounded-3xl p-6 text-center space-y-3" role="alert">
      <div className="text-3xl">⚠️</div>
      <h3 className="font-display font-semibold text-lg">Couldn't generate your trip</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        {error?.message || 'Something went wrong talking to the AI model.'}
      </p>
      <button
        onClick={onRetry}
        className="mt-2 px-5 py-2 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 active:scale-95 transition"
      >
        Try again
      </button>
    </div>
  )
}
