/**
 * Module Dependencies
 */

var roo = require('roo')(__dirname)

// web stuff
var join = require('path').join
var webpack = require('webpack')
var config = require('../')(__dirname, {
  entry: {
    dashboard: join(__dirname, 'pages', 'dashboard', 'index.jsx')
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: join('pages', '[name]', 'index.jsx')
  }
});
var compiler = webpack(config);
var production = process.env.NODE_ENV == 'production';

roo.use(function * (next) {
  yield next;
})

if (!production) {
  roo.use(require('koa-webpack-dev-middleware')(compiler, {
    noInfo: true,
    stats: 'error-only'
  }));

  roo.use(require('koa-webpack-hot-middleware')(compiler, {
    logs: false
  }));
} else {
  roo.static('dist')
}
// end webpack stuff

roo.mount('/dashboard', require('./pages/dashboard'))
roo.mount('/', require('./pages/home'))

roo.app.on('error', function(err) {
  console.log(err.stack);
})

process.on('uncaughtException', function(err) {
  console.log(err);
})

roo.listen(function() {
  var addr = this.address()
  console.log('listening on [%s]:%s', addr.address, addr.port)
})
