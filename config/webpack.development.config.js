var Webpack = require("webpack")
var path = require("path")

var ROOT_PATH = path.resolve(__dirname, "..")

module.exports = {
  devtool: "eval",

  entry: {
    bundle: [
      "react-hot-loader/patch",
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
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NoErrorsPlugin(),
    new Webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("development")
      }
    })
  ],

  devServer: {
    contentBase: path.resolve(ROOT_PATH, "public"),
    publicPath: "/",
    historyApiFallback: {
      index: "/index.html"
    },
    compress: false,
    hot: true,
    inline: true,
    progress: true
  }
}
