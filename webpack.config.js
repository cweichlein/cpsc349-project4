const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  output: {
    clean: true
  },
  entry: {
    index: path.resolve(__dirname, 'src/scripts/index.js'),
    tailwind: path.resolve(__dirname, 'src/styles/tailwind.css'),
    authentication: path.resolve(__dirname, 'src/old_scripts/authentication.js'),
    following: path.resolve(__dirname, 'src/old_scripts/following.js'),
    timelines: path.resolve(__dirname, 'src/old_scripts/timelines.js')
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
      inject: true,
      chunks: ['authentication', 'tailwind']
    }),
    new HtmlWebpackPlugin({
      filename: 'home_timeline.html',
      template: path.resolve(__dirname, 'src/home_timeline.html'),
      inject: true,
      chunks: ['following', 'timelines', 'tailwind']
    }),
    new HtmlWebpackPlugin({
      filename: 'public_timeline.html',
      template: path.resolve(__dirname, 'src/public_timeline.html'),
      inject: true,
      chunks: ['following', 'timelines', 'tailwind']
    }),
    new HtmlWebpackPlugin({
      filename: 'user_timeline.html',
      template: path.resolve(__dirname, 'src/user_timeline.html'),
      inject: true,
      chunks: ['following', 'timelines', 'tailwind']
    }),
    new HtmlWebpackPlugin({
      filename: 'following.html',
      template: path.resolve(__dirname, 'src/following.html'),
      inject: true,
      chunks: ['timelines', 'following', 'tailwind']
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
      template: path.resolve(__dirname, 'src/about.html'),
      inject: true,
      chunks: ['timelines', 'tailwind']
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/i,
        loader: 'standard-loader',
        options: {
          env: {
            browser: true
          }
        }
      }
    ]
  },
  mode: 'development',
  devtool: 'inline-source-map',
}