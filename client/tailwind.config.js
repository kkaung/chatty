/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/pages/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            container: {
                padding: {
                    DEFAULT: '1rem',
                },
            },
        },

        fontFamily: {
            pops: ['Poppins', 'sans-serif'],
            libas: ['Libre Baskerville', 'sans-serif'],
        },
    },
    plugins: [],
};
