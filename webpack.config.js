const path = require('path')

// const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const root = __dirname
const dist = path.resolve(root, 'dist')
const src = path.resolve(root, 'src')

const { NODE_ENV, HMR } = process.env

const isProd = NODE_ENV === 'production'
const isHMR = HMR === 'true'

const pages = [
  {
    script: path.resolve(src, 'index.ts'),
    template: path.resolve(src, 'index.html'),
    title: 'Playground Drag and Drop',
  },
].map((page) => {
  const s = path.parse(path.relative(src, page.script))
  const t = path.parse(path.relative(src, page.template))
  return {
    ...page,
    chunkName: path.join(s.dir, s.name),
    htmlPath: `/${[
      ...t.dir.split(path.sep),
      t.base === 'index.html' ? null : t.base,
    ]
      .filter(Boolean)
      .join('/')}`,
  }
})

const entries = pages.reduce((acc, { script, chunkName }) => {
  return {
    ...acc,
    [chunkName]: script,
  }
}, {})

const htmlWebpackPluginConfigs = pages.map(({ template, chunkName, title }) => {
  return new HtmlWebpackPlugin({
    filename: path.relative(src, template),
    template,
    chunks: [chunkName],
    title,
    templateParameters: { pages },
  })
})

module.exports = {
  target: 'web',
  mode: isProd ? 'production' : 'development',
  entry: entries,
  output: {
    path: dist,
    filename: isProd ? '[name].[contenthash].js' : '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.d.ts'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...htmlWebpackPluginConfigs,
    isHMR && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  devServer: {
    contentBase: dist,
    hot: isHMR,
  },
}
