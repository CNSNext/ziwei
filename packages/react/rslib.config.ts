import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      dts: {
        bundle: true,
      },
      output: {
        distPath: {
          root: "./dist/",
        },
      },
    },
    {
      format: "cjs",
      output: {
        distPath: {
          root: "./dist/",
        },
      },
    },
    {
      format: "umd",
      umdName: "ZiWei",
      output: {
        filename: {
          js: "ziwei.react.min.js",
        },
        externals: {
          react: "react",
          "react-dom": "react-dom",
          ahooks: "ahooks",
        },
        distPath: {
          root: "./dist",
        },
      },
    },
  ],
  output: {
    target: "web",
  },
  plugins: [pluginReact()],
});
