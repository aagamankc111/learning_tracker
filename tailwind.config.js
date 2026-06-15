/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0a0f1a',
          alt: '#111827',
          card: '#0f172a',
          border: '#1e293b',
        },
        accent: {
          DEFAULT: '#818cf8',
          dim: '#6366f1',
          hover: '#a5b4fc',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
