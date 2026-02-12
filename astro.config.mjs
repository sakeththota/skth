import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    icon(),
    expressiveCode({
      themes: ["ayu-dark"],
      styleOverrides: {
        uiFontSize: "1em",
        codeBackground: "var(--fd-surface)",
        frames: {
          editorBackground: "var(--fd-surface)",
          terminalBackground: "var(--fd-surface)",
          editorTabBarBackground: "var(--fd-surface)",
          editorActiveTabBackground: "var(--fd-surface)",
          editorActiveTabBorderColor: "transparent",
          editorActiveTabIndicatorTopColor: "transparent",
          editorActiveTabIndicatorBottomColor: "transparent",
          editorTabBarBorderBottomColor: "transparent",
          terminalTitlebarBackground: "var(--fd-surface)",
        },
      },
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },

  vite: {
    server: {
      allowedHosts: ["wsl"]
    }
  }
});
