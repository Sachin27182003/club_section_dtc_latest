import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dtc: {
          main: "#3e3f93",     // rgb(62, 63, 147)
          nav: "#232c72",      // rgb(35, 44, 114)
          text: "#e4e4bf",     // rgb(228, 228, 191)
          accent: "#d64329",   // rgb(214, 67, 41)
          section: "#4b4b9b",  
          footer: "#26345b",
          orange: "#ff7a18",
        }
      }
    },
  },
  plugins: [],
};
export default config;