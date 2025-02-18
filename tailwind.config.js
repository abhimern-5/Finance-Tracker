module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8", // Vibrant blue primary color
        secondary: "#065f46", // Deep green secondary color
        danger: "#b91c1c", // Dark red danger color
        background: "#f3f4f6", // Light grey background
        foreground: "#111827", // Dark grey foreground
        accent: "#d97706", // Accent color for highlights
        navbar: "#0f172a", // Dark blue-grey navbar background color
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
        heading: ["Poppins", "sans-serif"], // Font for headings
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
        108: "27rem", // More spacing options
      },
      borderRadius: {
        'xl': '1.5rem', // Larger border radius for modern look
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        slideIn: 'slideIn 0.5s ease-out',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};