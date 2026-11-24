/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { onyx: '#0F172A', volt: '#D4FF00', laser: '#2563EB', carbon: '#1E293B' },
      fontFamily: {
        display: ['"Barlow Condensed"', '"Arial Narrow"', 'Impact', 'sans-serif'],
        sans: ['Barlow', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
