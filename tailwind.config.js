/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // first: '#604CC3',
        first: '#b20660',
        second: '#8FD14F',
        third: '#F5F5F5',
        forth: '#FF6600',
      },
    },
  },
  plugins: [],
}
