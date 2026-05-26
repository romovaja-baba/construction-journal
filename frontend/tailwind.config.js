/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                journal: {
                    bg: "#e8e6e1",
                    subtle: "#efede8",
                    surface: "#f7f6f3",
                    border: "#b8b3a8",
                    "border-dark": "#7a756c",
                    ink: "#1c1b18",
                    muted: "#5a564f",
                    header: "#2a2824",
                    accent: "#9a3412",
                    "accent-hover": "#7c2d12",
                },
            },
            fontFamily: {
                sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
                mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
            },
        },
    },
    plugins: [],
};
