/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    safelist: [
        // Header background classes
        'bg-indigo-50',
        'bg-purple-50',

        // Button background classes
        'bg-indigo-600',
        'bg-purple-600',
        'hover:bg-indigo-700',
        'hover:bg-purple-700',
        'focus:ring-indigo-500',
        'focus:ring-purple-500'
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} 