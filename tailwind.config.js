const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...fontFamily.sans],
      },
      borderRadius: {
        DEFAULT: "12px",
        secondary: "8px",
        container: "16px",
        bento: "20px",
      },
      boxShadow: {
        DEFAULT: "0 1px 4px rgba(0, 0, 0, 0.1)",
        hover: "0 2px 8px rgba(0, 0, 0, 0.12)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
        "glass-hover": "0 16px 64px rgba(0, 0, 0, 0.15)",
        "financial": "0 4px 20px rgba(16, 185, 129, 0.1)",
        "financial-hover": "0 8px 40px rgba(16, 185, 129, 0.15)",
      },
      colors: {
        // Financial Trust Theme - Green Based
        primary: {
          DEFAULT: "#10B981", // emerald-500
          hover: "#059669",   // emerald-600
          light: "#34D399",   // emerald-400
          dark: "#047857",    // emerald-700
        },
        secondary: {
          DEFAULT: "#6B7280", // gray-500
          hover: "#4B5563",   // gray-600
          light: "#9CA3AF",   // gray-400
          dark: "#374151",    // gray-700
        },
        accent: {
          DEFAULT: "#3B82F6", // blue-500
          hover: "#2563EB",   // blue-600
          light: "#60A5FA",   // blue-400
          dark: "#1D4ED8",    // blue-700
        },
        // Financial specific colors
        financial: {
          success: "#10B981",  // emerald-500 - income/positive
          warning: "#F59E0B",  // amber-500 - attention
          danger: "#EF4444",   // red-500 - expenses/negative
          info: "#3B82F6",     // blue-500 - informational
        },
        // Background system
        background: {
          primary: "#0F172A",   // slate-900
          secondary: "#1E293B", // slate-800
          tertiary: "#334155",  // slate-700
        },
        // Glass morphism - Enhanced for better contrast
        glass: {
          light: "rgba(255, 255, 255, 0.05)",
          medium: "rgba(255, 255, 255, 0.08)",
          dark: "rgba(0, 0, 0, 0.2)",
          darker: "rgba(0, 0, 0, 0.4)",
          green: "rgba(16, 185, 129, 0.08)",
          card: "rgba(255, 255, 255, 0.03)",
          hover: "rgba(255, 255, 255, 0.06)",
        },
      },
      spacing: {
        "form-field": "16px",
        section: "32px",
        bento: "24px",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "glass-hover": "glassHover 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glassHover: {
          "0%": { transform: "scale(1)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" },
          "100%": { transform: "scale(1.02)", boxShadow: "0 16px 64px rgba(16, 185, 129, 0.15)" },
        },
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["hover", "active"],
      backdropBlur: ["hover", "focus"],
      transform: ["hover", "active"],
    },
  },
};
