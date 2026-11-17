/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080B14',
        'bg-alt': '#0A0F1C',
        card: '#111B2D',
        'card-border': '#1E2B45',
        'chip-bg': '#0C1424',
        'chip-border': '#22314F',
        accent: {
          DEFAULT: '#4F8CFF',
          hover: '#3b78f0',
        },
        'accent-2': '#8B5CF6',
        text: '#F8FAFC',
        'text-body': '#B6C2D6',
        'text-muted': '#94A3B8',
        'border-separator': '#1B2740',
        'secondary-btn': '#0E1626',
        'secondary-border': '#2A3A5C',
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Outfit'", "'Inter'", 'system-ui', '-apple-system', 'sans-serif'],
        display: ["'Outfit'", "'Fredoka'", 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      borderRadius: {
        card: '16px',
        'card-mobile': '14px',
        btn: '12px',
      },
    },
  },
  plugins: [],
}
