module.exports = {
  content: [
    "./pages//*.{js,ts,jsx,tsx}",
    "./components//*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#10b981",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // For form styling
    require("@tailwindcss/typography"), // For typography utilities
  ],
};
