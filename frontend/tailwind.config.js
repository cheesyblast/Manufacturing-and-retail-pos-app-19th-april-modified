/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
        extend: {
            fontFamily: {
                heading: ["'Cabinet Grotesk'", "sans-serif"],
                body: ["'Manrope'", "sans-serif"],
                mono: ["'JetBrains Mono'", "monospace"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                beige: {
                    50: "#FDFDFC",
                    100: "#F7F6F2",
                    200: "#EFECE5",
                    300: "#E5E1D8",
                    400: "#D2C9B6",
                    500: "#BFA588",
                },
                navy: {
                    50: "#F0F2F5",
                    100: "#D9DFE8",
                    500: "#3B4D73",
                    700: "#1E2C4A",
                    800: "#131D33",
                    900: "#0A101D",
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
                status: {
                    success: "#4A5D4E",
                    "success-bg": "#E8ECE9",
                    warning: "#B8860B",
                    "warning-bg": "#FDF8E7",
                    danger: "#8C3A3A",
                    "danger-bg": "#F5E9E9",
                },
            },
            keyframes: {
                "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
                "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
                "fade-in": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.5s ease-out forwards",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
