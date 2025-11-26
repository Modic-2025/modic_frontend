/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/[art_id]/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 기존
        chatResponseText: "#505050",

        black: "#000000",
        white: "#FFFFFF",

        "gray-1": "#F3F4F6",
        "gray-4": "#9E9FAD",
        "gray-8": "#28282E",
        "gray-9": "#1A1B1E",

        main: "#FF5100",
        point_red: "#EB003B",
      },
    },
  },
  plugins: [require("tailwindcss-motion")],
};
