// Only use native node.js API's and references to ./lib here, this file is not transpiled!
//
// Note that if this tree-shaking test fails, there is probably
// new functionality which forces Webpack to turn off tree shaking.
//
// Typical solutions to get tree-shaking working again are:
//
// - move code into a separate file to isolate it
// - add /* #__PURE__ */ when creating a variable

const path = require('path')
const cp = require('child_process')
const assert = require('assert')
const del = require('del')
const webpack = require('webpack')

describe('tree shaking', function () {
  const appName = 'treeShakingApp.js'
  const bundleName = 'treeShakingApp.bundle.js'

  before(() => {
    cleanup()
  })

  after(() => {
    cleanup()
  })

  function cleanup () {
    del.sync(path.join(__dirname, bundleName))
  }

  it('should apply tree-shaking when bundling', function (done) {
    // This test takes a few seconds
    this.timeout(60 * 1000)

    const webpackConfig = {
      entry: path.join(__dirname, appName),
      mode: 'production',
      output: {
        filename: bundleName,
        path: __dirname
      }
    }

    webpack(webpackConfig).run(function (err, stats) {
      if (err) {
        console.error(err)
        done(err)
        return
      }

      const info = stats.toJson()
      if (stats.hasErrors()) {
        console.error('Webpack errors:\n' + info.errors.join('\n'))
        done(new Error('Compile failed'))
        return
      }

      // Test whether the size is small enough
      // At this moment, the full library size is 559137 bytes (unzipped),
      // and the size of this tree-shaken bundle is 98494 bytes (unzipped)
      // this may grow or shrink in the future
      assert.strictEqual(info.assets[0].name, bundleName)
      const size = info.assets[0].size
      const maxSize = 100000
      assert(size < maxSize,
        'bundled size must be small enough ' +
        '(actual size: ' + size + ' bytes, max size: ' + maxSize + ' bytes)')

      // Execute the bundle to test whether it actually works
      cp.exec('node ' + path.join(__dirname, bundleName), function (err, result) {
        if (err) {
          done(err)
          return
        }

        assert.strictEqual(result.replace(/\s/g, ''), '3')

        done()
      })
    })
  })
})