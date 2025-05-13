/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/art/[art_id]/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chatResponseText: "#505050",
      },
    },
  },
  plugins: [],
};
