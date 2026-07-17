import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="w-10 h-10 grid place-items-center rounded-full glass hover:scale-105 active:scale-95 transition-transform"
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  )
}
