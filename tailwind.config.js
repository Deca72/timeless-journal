/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: '0.65rem',    // smaller than Tailwind default
        sm: '0.75rem',
        base: '0.875rem', // was 1rem
        lg: '1rem',       // was 1.125rem
        xl: '1.25rem',    // was 1.25rem (same)
        '2xl': '1.5rem',  // was 1.5rem
        '3xl': '1.75rem', // was 1.875rem
        '4xl': '2rem',    // was 2.25rem
        '5xl': '2.25rem', // was 3rem
        '6xl': '2.5rem',  // was 3.75rem
      },
    },
  },
  plugins: [],
};
