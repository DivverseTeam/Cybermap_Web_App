import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      boxShadow: {
        all: "0 2px 8px 8px rgba(0, 0, 0, 0.05)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
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
        ring: "hsla(227, 100%, 59%, 1)",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        gray: {
          "1": "rgba(108, 132, 157, 0.32)",
          "2": "#F9F9FB",
          "9": "rgba(139, 141, 152, 1)",
          normal: "rgba(25, 40, 57, 1)",
          "11": "#62636C",
          "12": "#1E1F24",
        },
        neutral: {
          "2": "#F9F9FB",
          "5": "#E0E1E6",
          "11": "#60646C",
          "12": "#1C2024",
          normal: "#243547",
        },
        brand: {
          "2": "#962DFF",
        },
        positive: {
          subtle: "rgba(0, 162, 81, 0.09)",
          intense: "rgba(0, 135, 67, 1)",
        },
        negative: {
          subtle: "rgba(217, 45, 32, 0.09)",
          intense: "rgba(217, 45, 32, 1)",
        },
        notice: {
          subtle: "rgba(233, 105, 12, 0.09)",
          intense: "rgba(198, 92, 16, 1)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-debug-screens"),
  ],
} satisfies Config;
