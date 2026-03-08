export const theme = {
  colors: {
    background:      "hsl(220 5% 96%)",
    surface:         "hsl(0 0% 100%)",
    surfaceHover:    "hsl(220 5% 97%)",
    border:          "hsl(220 5% 90%)",
    borderSubtle:    "hsl(220 5% 93%)",
    text: {
      primary:   "hsl(220 10% 11%)",
      secondary: "hsl(220 5% 40%)",
      muted:     "hsl(220 5% 48%)",
      disabled:  "hsl(220 5% 70%)",
    },
    accent: {
      blue:       "hsl(211 100% 45%)",
      blueFaint:  "hsl(211 100% 45% / 0.06)",
      blueSubtle: "hsl(211 100% 45% / 0.12)",
      blueBorder: "hsl(211 100% 45% / 0.20)",
    },
    status: {
      active:    { bg: "bg-emerald-50",  text: "text-emerald-700", ring: "border-emerald-200" },
      planned:   { bg: "bg-zinc-100",    text: "text-zinc-600",    ring: "border-zinc-200"   },
      completed: { bg: "bg-blue-50",     text: "text-blue-700",    ring: "border-blue-200"   },
      cancelled: { bg: "bg-red-50",      text: "text-red-700",     ring: "border-red-200"    },
    },
    roles: {
      voice_actor:    "bg-violet-50 text-violet-700 border-violet-200",
      director:       "bg-blue-50 text-blue-700 border-blue-200",
      engineer:       "bg-amber-50 text-amber-700 border-amber-200",
      platform_owner: "bg-rose-50 text-rose-700 border-rose-200",
      studio_admin:   "bg-primary/10 text-primary border-primary/20",
    },
  },

  spacing: {
    pagePx:   "px-5",
    pagePy:   "py-8",
    sectionGap: "space-y-8",
    cardPad:  "p-5",
    innerGap: "gap-3",
  },

  typography: {
    pageTitle:    "text-3xl font-bold tracking-tight",
    pageSubtitle: "text-sm text-muted-foreground mt-1",
    sectionLabel: "text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
    cardTitle:    "text-sm font-medium text-foreground/80",
    statValue:    "text-2xl font-bold tracking-tight",
    body:         "text-sm text-foreground",
    caption:      "text-xs text-muted-foreground",
    mono:         "font-mono text-xs",
  },

  radius: {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    full: "rounded-full",
  },

  animation: {
    enter:   "page-enter",
    shimmer: "shimmer",
    press:   "press-effect",
  },
} as const;

export type ThemeColors = typeof theme.colors;
export type ThemeTypography = typeof theme.typography;

export const t = theme.typography;
export const c = theme.colors;
export const r = theme.radius;
export const s = theme.spacing;
