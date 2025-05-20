/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        pending: "var(--color-pending)",
        neutral: "var(--color-neutral)",
        light: "var(--color-light)",
        shadow: "var(--color-shadow)",
      },
    },
  },
  plugins: [],
}
