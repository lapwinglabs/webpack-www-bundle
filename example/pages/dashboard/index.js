var roo = module.exports = require('roo')(__dirname)
roo.get('/', function * () {
  this.body = yield roo.render('index.jade', {
    production: process.env.NODE_ENV === 'production'
  })
})
