import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  html: {
    tags: [
      {
        tag: "link",
        attrs: {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/cn-fontsource-source-han-serif-sc-vf/font.css",
        },
      },
    ],
  },
  server: {
    port: 4511,
    historyApiFallback: true,
  },
  plugins: [pluginReact()],
  source: {
    entry: {
      index: "./playground/index.tsx",
    },
  },
});
