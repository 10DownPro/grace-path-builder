import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Inter', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        wordmark: ['Bebas Neue', 'sans-serif'],
      },
      // Accessibility-first typography scale.
      // Floor for body/supporting/micro text is raised so the entire app reads
      // comfortably from arm's length on mobile. All sizes in rem (16px base).
      fontSize: {
        xs:   ['0.875rem', { lineHeight: '1.55' }], // 14px - micro only
        sm:   ['1rem',     { lineHeight: '1.6'  }], // 16px - supporting
        base: ['1.125rem', { lineHeight: '1.65' }], // 18px - body min
        lg:   ['1.25rem',  { lineHeight: '1.6'  }], // 20px
        xl:   ['1.5rem',   { lineHeight: '1.45' }], // 24px - card title
        '2xl':['1.75rem',  { lineHeight: '1.35' }], // 28px - section title
        '3xl':['2rem',     { lineHeight: '1.25' }], // 32px
        '4xl':['2.25rem',  { lineHeight: '1.2'  }], // 36px - page title
        '5xl':['3rem',     { lineHeight: '1.1'  }], // 48px - display
        '6xl':['3.5rem',   { lineHeight: '1.05' }], // 56px
        '7xl':['4rem',     { lineHeight: '1.05' }], // 64px
      },
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
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        "accent-warm": {
          DEFAULT: "hsl(var(--accent-warm))",
          foreground: "hsl(var(--accent-warm-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
