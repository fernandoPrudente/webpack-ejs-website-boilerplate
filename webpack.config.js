const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist')
const publicPath = path.resolve(__dirname, 'src/public')

module.exports = {
    entry: {
        app: './src/scripts/app.js'
    },
    output: {
      filename: '[name].[hash:20].js',
      path: buildPath
    },    
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
          patterns: [
            { from: publicPath, to: buildPath }
          ],
        }),          
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css'
        }),        
        new HtmlWebpackPlugin({
            template: './src/index.ejs',
            inject: 'body',
            chunks: ['app'],
            filename: 'index.html'
        }),
    ],
    module: {      
      rules: [
          {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
          },          
          {
            test: /\.ejs$/, 
            use: {
              loader: 'ejs-compiled-loader',
              options: {
                htmlmin: true,
                htmlminOptions: {
                  removeComments: true
                }
              }
          }
        }]
      },
      optimization: {
        minimize: true,
        minimizer: [
          // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
          // `...`,
          new CssMinimizerPlugin(),
          new TerserPlugin()
        ],
      },       
}