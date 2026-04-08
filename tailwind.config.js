/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#D7CCC8',
        'beige': '#BCAAA4',
        'primary-text': '#4E342E',
        'deep-accent': '#3E2723',
        'bg-page': '#EAE2DE',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'input': '12px',
        'btn': '12px',
      },
      spacing: {
        '32': '8rem',
      },
      zIndex: {
        '99': '99',
        '1000': '1000',
      },
    },
  },
  plugins: [],
}
