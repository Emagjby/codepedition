/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'dark-purple': '#2E1A47',
        'vibrant-purple': '#6A4C9C',
        'indigo-blue': '#3B2A61',
        'electric-blue': '#4F80FF',
        
        // Secondary Colors
        'dark-gray': '#1A1A1A',
        'light-gray': '#D1D5DB',
        'soft-lavender': '#E0C8FF',
        'soft-yellow': '#FFCB2D',

        // Functional color mapping
        'primary': '#2E1A47',
        'secondary': '#3B2A61',
        'accent': '#4F80FF',
        'highlight': '#6A4C9C',
        'warning': '#FFCB2D',
        'background-primary': '#2E1A47',
        'background-secondary': '#1A1A1A',
        'background-card': '#3B2A61',
        'text-primary': '#D1D5DB',
        'text-secondary': '#E0C8FF',
        'button-primary': '#4F80FF',
        'button-secondary': '#E0C8FF',
      },
    },
  },
  plugins: [],
} 