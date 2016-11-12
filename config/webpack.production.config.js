var Webpack = require("webpack")
var path = require("path")

var ROOT_PATH = path.resolve(__dirname, "..")

module.exports = {
  devtool: "cheap-module-eval-source-map",
  entry: {
    bundle: [
      path.resolve(ROOT_PATH, "src", "cards", "index")
    ]
  },

  output: {
    path: path.resolve(ROOT_PATH, "public"),
    publicPath: "/",
    filename: "[name].js"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(ROOT_PATH, "src"),
        loaders: ["babel?cacheDirectory"]
      },
      {
        test: /\.css$/,
        include: path.resolve(ROOT_PATH, "src"),
        loaders: ["style", "css"]
      },
      {
        test: /\.png/,
        include: path.resolve(ROOT_PATH, "src"),
        loaders: ["file"]
      }
    ]
  },

  resolve: {
    extensions: ["", ".js"],
    root: [
      path.resolve(ROOT_PATH, "src"),
      path.resolve(ROOT_PATH, "src", "cards")
    ]
  },

  plugins: [
    new Webpack.NoErrorsPlugin(),
    new Webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    })
  ]
}

