/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        "brand-bg": "#f1f8fd",
        "brand-accent": "#2c3082",
      },
      fontFamily: {
        body: ["akzidenz-grotesk-next-pro", "sans-serif"],
        header: ["source-serif-pro", "serif"],
        
      },
    },
  },

  plugins: [],
};
