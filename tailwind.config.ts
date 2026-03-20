/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F7FA",
        foreground: "#1A1A1A",
        primary: {
          DEFAULT: "#FF7A00",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0B4F6C",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#FFA64D",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#6B7280",
          foreground: "#ffffff",
        },
        brand: {
          blue: "#0B4F6C",
          orange: "#FF7A00",
          accent: "#FFA64D",
          bg: "#F5F7FA",
          dark: "#1A1A1A",
          light: "#6B7280",
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
