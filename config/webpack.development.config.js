var Webpack = require("webpack")
var path = require("path")

var firebase = require("./firebase.json")

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
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(ROOT_PATH, "src"),
        loaders: ["babel-loader?cacheDirectory"]
      },
      {
        test: /\.css$/,
        include: path.resolve(ROOT_PATH, "src"),
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.png/,
        include: path.resolve(ROOT_PATH, "src"),
        loaders: ["url-loader?limit=10000", "img-loader"]
      },
      {
        test: /\.(eot|svg|ttf|otf|woff|woff2)$/,
        include: path.resolve(ROOT_PATH, "src"),
        loaders: ["file-loader?name=./assets/fonts/[name].[ext]"]
      }
    ]
  },

  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NoErrorsPlugin(),
    new Webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("development")
      },
      "FIREBASE_CONFIG": JSON.stringify(firebase.development)
    })
  ],

  devServer: {
    contentBase: path.resolve(ROOT_PATH, "public"),
    publicPath: "/",
    historyApiFallback: true,
    compress: false,
    hot: true,
    inline: true,
    progress: true
  }
}
