var webpack = require('webpack')
var join = require('path').join
var config = require('..')(__dirname, {
  entry: {
    dashboard: join(__dirname, 'pages', 'dashboard', 'index.jsx')
  },
  output: {
    path: join(__dirname, 'dist')
  }
})

webpack(config).run(function(err, stats) {
  if (err) throw err
  stats = stats.toJson()
  if (stats.errors.length > 0) {
    throw new Error(stats.errors.join('\n\n'))
  }
})
