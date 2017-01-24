'use strict'

var fs = require('fs')
var tmp = require('tmp')
var Acho = require('acho')
var path = require('path')
var Download = require('download')
var logger = new Acho({
  color: true
})

var fromCodePoint = function (codepoint) {
  var code = typeof codepoint === 'string' ? parseInt(codepoint, 16) : codepoint
  if (code < 0x10000) return String.fromCharCode(code)
  code -= 0x10000
  return String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF))
}

tmp.dir(function _tempDirCreated (err, tmpFolder, cleanup) {
  if (err) return logger.error(err)

  logger.info('Created temporal folder in ' + tmpFolder)
  logger.info('Downloading file...')

  new Download({
    mode: '755',
    extract: true
  })
    .get('https://github.com/twitter/twemoji/archive/gh-pages.zip')
    .dest(tmpFolder)
    .run(function (err) {
      if (err) return logger.error(err)
      logger.info('File downloaded and extracted succesful.')

      var folder = fs.readdirSync(tmpFolder)[0]
      var emojiDirectory = path.resolve(tmpFolder, folder, 'assets')

      logger.info('Read the directory ' + emojiDirectory)

      fs.readdir(emojiDirectory, function (err, files) {
        logger.info('Generating emoji keywords')
        if (err) return logger.error(err)
        var result = files.map(function (file) {
          file = file.split('.')
          return fromCodePoint(file[0])
        })

        var data = JSON.stringify(result, null, 2)
        fs.writeFile('emojis.json', data, function (err) {
          if (err) throw err
          logger.success('File saved!')
        })

      // cleanup(); disable to prevent remove other tmp files of the system.
      })
    })
})
