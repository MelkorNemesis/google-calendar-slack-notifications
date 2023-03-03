import path from "path";
import nodeExternals from "webpack-node-externals";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: './src/index.ts',
  externals: [nodeExternals()],
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "dist"),
    filename: "index.js",
  },
  target: "node",
  cache: {
    type: "filesystem",
    allowCollectingMemory: true,
    cacheDirectory: path.resolve(".webpackCache"),
  },
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
};
