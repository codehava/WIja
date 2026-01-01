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
                // WIJA Brand Colors
                wija: {
                    primary: '#FAB034',
                    secondary: '#F89F1F',
                    accent: '#E68A0F',
                },
                // Gender Colors
                node: {
                    male: '#3B82F6',
                    female: '#EC4899',
                },
                // Lontara Script Colors
                lontara: {
                    text: '#92400E',
                    bg: '#FEF3C7',
                },
            },
            fontFamily: {
                lontara: ['Noto Sans Buginese', 'serif'],
            },
        },
    },
    plugins: [],
};
