// @ts-ignore
import webpackPreprocessor from "@cypress/webpack-preprocessor";

export default {
  ...(on: any) => {
    const options = {
      webpackOptions: {
        resolve: {
          extensions: [".ts", ".js"],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: "ts-loader",
                },
              ],
            },
          ],
        },
      },
    };

    on("file:preprocessor", webpackPreprocessor(options));
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
