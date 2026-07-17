export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f0ff',
          100: '#e6e2ff',
          300: '#b3a6ff',
          500: '#7c5cff',
          600: '#6a45f5',
          700: '#5732d6',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
