import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Status code colors
    "bg-green-500/10",
    "text-green-500",
    "border-green-500/30",
    "bg-blue-500/10",
    "text-blue-500",
    "border-blue-500/30",
    "bg-yellow-500/10",
    "text-yellow-500",
    "border-yellow-500/30",
    "bg-red-500/10",
    "text-red-500",
    "border-red-500/30",
    "bg-gray-500/10",
    "text-gray-500",
    "border-gray-500/30",

    // New media type colors
    "bg-orange-500/10",
    "text-orange-500",
    "border-orange-500/30",
    "bg-red-600/10",
    "text-red-600",
    "border-red-600/30",
    "bg-green-600/10",
    "text-green-600",
    "border-green-600/30",
    "bg-purple-500/10",
    "text-purple-500",
    "border-purple-500/30",
    "bg-indigo-500/10",
    "text-indigo-500",
    "border-indigo-500/30",
    "bg-pink-500/10",
    "text-pink-500",
    "border-pink-500/30",
    "bg-teal-500/10",
    "text-teal-500",
    "border-teal-500/30",
    "bg-cyan-500/10",
    "text-cyan-500",
    "border-cyan-500/30",
    "bg-emerald-500/10",
    "text-emerald-500",
    "border-emerald-500/30",
    "bg-lime-500/10",
    "text-lime-500",
    "border-lime-500/30",
    "bg-rose-500/10",
    "text-rose-500",
    "border-rose-500/30",
    "bg-amber-500/10",
    "text-amber-500",
    "border-amber-500/30",
    "bg-slate-500/10",
    "text-slate-500",
    "border-slate-500/30",

    // Badge variants
    "badge-json",
    "badge-png",
    "badge-jpeg",
    "badge-text",
    "badge-bin",
    "badge-get",
    "badge-post",
    "badge-put",
    "badge-delete",
    "badge-mp4",
    "badge-webm",
    "badge-mp3",
    "badge-wav",
    "badge-gif",
    "badge-svg",
    "badge-webp",
    "badge-pdf",
    "badge-xml",
    "badge-csv",
    "badge-html",
    "badge-zip",

    // Status classes
    "status-200",
    "status-400",
    "status-403",
    "status-429",
    "status-500",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config

