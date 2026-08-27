/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#f4f0e6',
          light: '#f9f6f0',
          grid: '#e2dbc9',
        },
        olive: {
          light: '#657a69',
          DEFAULT: '#4a5d4e',
          dark: '#3d4f41',
          moss: '#2b362c',
          active: '#354539',
        },
        winbg: {
          DEFAULT: '#f2efea',
          inset: '#e6e2d8',
          header: '#3d4f41',
        },
        accent: {
          DEFAULT: '#d9a05b',
          amber: '#e2b85a',
        },
        winborder: {
          light: '#ffffff',
          mid: '#dfdfdf',
          dark: '#7d877e',
          shadow: '#2b362c'
        }
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
        pixel: ['"VT323"', '"Press Start 2P"', 'Courier', 'monospace'],
        retro: ['Tahoma', 'Geneva', 'Verdana', 'sans-serif']
      }
    },
  },
  plugins: [],
}
