/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',     // App directory
      './pages/**/*.{js,ts,jsx,tsx,mdx}',   // Fallback for pages dir
      './components/**/*.{js,ts,jsx,tsx}',  // Components
      './content/**/*.{md,mdx}',            // Markdown/MDX content folders
    ],
    theme: {
      extend: {
        typography: {
          DEFAULT: {
            css: {
              maxWidth: '100%', // Let prose content expand fully
            },
          },
        },
      },
    },
    plugins: [require('@tailwindcss/typography')],
  };
  