/**
 * Module Dependencies
 */

var webpack = require("webpack");
var join = require("path").join;
var relative = require('path').relative;
var log_update = require('log-update');

/**
 * Plugins
 */

var production = process.env.NODE_ENV == 'production'
var NODE_PATH = process.env.NODE_PATH


/**
 * Configuration
 */

var cssimport = require('postcss-import')
var vars = require('postcss-simple-vars')
var fontpath = require('postcss-fontpath')
var clearfix = require('postcss-clearfix')
var extend = require('postcss-simple-extend')
var autoprefixer = require('autoprefixer')
var deep_assign = require('deep-assign')
var nested = require('postcss-nested')
var url = require('postcss-url')

/**
 * Loaders
 */

var ReactTransformCatchErrors = require('react-transform-catch-errors')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var ReactTransform = require('babel-plugin-react-transform')
var ReactTransformHMR = require('react-transform-hmr')
var HotMiddleware = require('webpack-hot-middleware')
var webpackNanoLogs = require('webpack-nano-logs')
var MarkdownLoader = require('markdown-loader')
var failPlugin = require('webpack-fail-plugin')
var RedboxReact = require('redbox-react')
var PostCSSLoader = require('postcss-loader')
var BabelLoader = require('babel-loader')
var Styleloader = require('style-loader')
var CSSLoader = require('css-loader')
var JSONLoader = require('json-loader')
var URLLoader = require('url-loader')
var FileLoader = require('file-loader')
var HTMLLoader = require('html-loader')
var React = require('react')
var _node_path;

if (!production) {
  var css = 'style-loader!css-loader!postcss-loader'
} else {
  var css = ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader', {
    publicPath: '/'
  })
}

if (!production) {
  var style = 'style-loader!css-loader?module&localIdentName=[path][name]---[local]---[hash:base64:5]!postcss-loader'
} else {
  var style = ExtractTextPlugin.extract('style-loader', 'css-loader?module!postcss-loader', {
    publicPath: '/'
  })
}

module.exports = function config (root, config) {
  config = config || {}

  var minify = config.minify === undefined
    ? production
    : config.minify

  var loaders = [
    {
      test: /\.jsx?$/,
      loader: 'babel',
      include: [join(root, 'pages'), join(root, 'lib')],
      query: {
        cacheDirectory: true
      }
    },
    {
      test: /\.css$/,
      include: [join(root, 'pages'), join(root, 'lib')],
      loader: css
    },
    {
      test: /\.style$/,
      loader: style
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      loader: 'url-loader?limit=10000'
    },
    {
      test: /\.(woff|woff2)/,
      loader: 'url-loader?limit=10000'
    },
    {
      test: /\.(ttf|eot)$/,
      loader: 'file-loader'
    },
    {
      test: /\.html$/,
      loader: 'html'
    },
    {
      test: /\.(md|markdown)$/,
      loader: 'html!markdown'
    }
  ]

  /**
   * Plugins
   */

  var plugins = [
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': Object.keys(process.env).reduce(function(o, k) {
        o[k] = JSON.stringify(process.env[k]);
        return o;
      }, {})
    }),
    webpackNanoLogs,
    failPlugin
  ]

  if (production) {
    plugins.push(new webpack.ProgressPlugin(on_progress))
    plugins.push(new webpack.optimize.DedupePlugin())
    plugins.push(new ExtractTextPlugin("/pages/[name]/[name].css"))
  }

  if (minify) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      test: /\.jsx?$/,
      compress: {
        warnings: false
      }
    }))
  }

  function inc(script) {
    var out = [];
    !production && out.push('webpack-hot-middleware/client?noInfo=true&reload=true')
    out.push(script)
    return out
  }

  function postcss () {
    var np = node_path(root)
    return [
      cssimport({
        path: np ? np : [],
        glob: true,
        root: root,
        onImport: function (files) {
          files.forEach(function(file) {
            this.addDependency(file)
          }, this)
        }.bind(this)
      }),
      nested(),
      vars(),
      extend(),
      clearfix(),
      fontpath(),
      url({
        url: function(url, decl, from, dirname, to, options) {
          if (http(url)) return url;
          url = url.split(/[?#]/)[0];
          return './' + relative(from, join(dirname, url));
        }
      }),
      autoprefixer({ remove: production ? true : false, browsers: ['last 2 versions'] })
    ]
  }

  config = deep_assign({
    devtool: production ? null : 'eval',
    resolve: {
      root: join(root, 'lib'),
      extensions: ['', '.js', '.jsx']
    },
    postcss: postcss,
    entry: {},
    output: {
      path: join(root, 'dist'),
      filename: 'pages/[name]/[name].jsx',
      publicPath: '/'
    },
    module: {
      loaders: loaders
    },
    cache: {},
    watch: production ? false : true,
    resolveLoader: {
      root: join(__dirname, 'node_modules')
    },
    plugins: plugins
  }, config)

  // load in the hot module stuff
  for (var entry in config.entry) {
    config.entry[entry] = inc(config.entry[entry])
  }

  return config
}

 /**
  * On progress
  */

 function on_progress (progress, message) {
   log_update('\n  < webpack >  ' + Math.round(progress * 100) + '%  :  ' + (message || 'done') + '\n')
 }

/**
 * Lazily load the node_path
 */

function node_path(root) {
  return _node_path
    || (_node_path = NODE_PATH && join(root, NODE_PATH))
}

/**
 * Check if `url` is an HTTP URL.
 *
 * @param {String} path
 * @param {Boolean}
 * @api private
 */

function http(url) {
  return url.slice(0, 4) === 'http'
    || url.slice(0, 3) === '://'
    || false;
}

