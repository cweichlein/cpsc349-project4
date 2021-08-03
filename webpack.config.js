const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  output: {
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
      template: path.resolve(__dirname, 'src/about.html')
    }),
    new HtmlWebpackPlugin({
      filename: 'home_timeline.html',
      template: path.resolve(__dirname, 'src/home_timeline.html')
    }),
    new HtmlWebpackPlugin({
      filename: 'public_timeline.html',
      template: path.resolve(__dirname, 'src/public_timeline.html')
    }),
    new HtmlWebpackPlugin({
      filename: 'user_timeline.html',
      template: path.resolve(__dirname, 'src/user_timeline.html')
    }),
    new HtmlWebpackPlugin({
      filename: 'following.html',
      template: path.resolve(__dirname, 'src/following.html')
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
