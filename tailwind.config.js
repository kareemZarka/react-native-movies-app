/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./app.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
            primary: '#000000',
            surface: '#111111',
            border: '#1F1F1F',
            text: {
                primary: '#FFFFFF',
                secondary: '#B3B3B3',
            },
            neon: {
                pink: '#FF4F9A',
                blue: '#4A90F7',
                teal: '#36F1CD',
            },
            gold: '#FFD700',
        }
    },
  },
  plugins: [],
};
