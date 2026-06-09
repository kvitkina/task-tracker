/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b', // глубокий темный
        surface: '#18181b',    // цвет карточек и панелей
        border: '#27272a',     // тонкие границы
        primary: '#3b82f6',    // акцентный синий
        text: '#f4f4f5',       // светлый текст
        muted: '#a1a1aa',      // приглушенный текст
      },
    },
  },
  plugins: [],
}
