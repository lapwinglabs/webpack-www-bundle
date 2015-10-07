# webpack-www-bundle

Our asset pipeline for [finbox.io](https://finbox.io) and beyond. This module picks up
where [www-bundle](https://github.com/lapwinglabs/www-bundle) leaves off. We recently ran into a wall using React, where our Javascript was 800kb minified, cause our site to take around 3 seconds to load.

We needed asynchronous loading to bring the initial payload down but it's nearly impossible to do that with Browserify, while not including the same module multiple times. I explored external modules as well as factor bundle, but they are just not precise enough tools.

Everyone's environment is a bit different, so I don't imagine this would be super useful to others, without building it yourself.

That being said, I did spent quite a bit of time tweaking things to make the environment less verbose and turned on most of the nice features of webpack, so maybe you can use this repository as a reference.

## Features

- It's middleware so you don't need to run two servers
- Javascript, CSS, HTML, JSON, and markdown support
- Automatic combining of common code (`/common.js`)
- Lives outside of your main app (it's a module)
- Local CSS module support (via `.style` files)
- Automatic inlining of CSS assets under 10kb
- PostCSS with CSSnext and built in
- Asynchronous module loading
- ES6 support via Babel
- Local CSS Modules
- Hot reloading

## Installation

```
npm install webpack-www-bundle
```

## Usage

First you'll want to configure the build. This will be application specific
and mostly depends on your entry points and how you want to structure the app.

**webpack.js**

```js
var webpack = require('webpack')
var join = require('path').join
var root = join(__dirname, '..', '..')

var config = require('webpack-www-bundle')(root, {
  entry: {
    dashboard: join(root, 'pages', 'dashboard', 'dashboard.jsx')
  },
  output: {
    path: join(root, 'dist'),
    filename: join('pages', '[name]', '[name].jsx')
  }
})

module.exports = webpack(config)
```

Here's the server middleware you'll need to get this module working. You'll need to install `koa-webpack-dev-middleware` and `koa-webpack-hot-middleware` if you're using koa with hot-reloading:

**server.js**

```js
// the file above
var webpack = require('./lib/webpack');

if (process.env.NODE_ENV !== 'production') {
  app.use(require('koa-webpack-dev-middleware')(webpack, {
    noInfo: true,
    stats: 'errors-only'
  }));

  app.use(require('koa-webpack-hot-middleware')(webpack, {
    logs: false
  }));
}

app.static('dist');
```

Then in your HTML, you'll want something like this:

```html
<html>
  <head>
    {#production}
      <!--
        in dev, CSS is placed in <style> tags,
        in prod, it's extracted out. this will
        reference that bundle in production.
      -->
      <link href="/pages/dashboard/dashboard.css" />
    {/production}
  </head>
  <body>
    <!-- chunks common to all your entries -->
    <script src='/common.js'></script>
    <!-- your page build -->
    <script src='/pages/dashboard/dashboard.js'></script>
  </body>
```

## Running the example

Development:

```
make development
```

Production:

```
make build
make production
```
