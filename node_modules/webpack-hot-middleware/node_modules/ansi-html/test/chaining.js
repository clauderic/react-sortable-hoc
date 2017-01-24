var ansiHTML = require('../'),
    chalk    = require('chalk'),
    chai     = require('chai'),
    expect   = chai.expect,
    _ = require('lodash'),
    should   = chai.should();

var fns = {};
Object.keys(chalk.styles).forEach(function(key){
  var openCode = chalk.styles[key].open.match(/\u001b\[(\d+)m/)[1],
      closeCode = chalk.styles[key].close.match(/\u001b\[(\d+)m/)[1],
      openTag = ansiHTML.tags.open[openCode];

  fns[key] = {
    ansi: function(txt){
      return chalk[key](txt)
    },
    html: function(txt){
      return (openTag[0] == '<' ? openTag : ('<span style="' + openTag + ';">')) + txt + ansiHTML.tags.close[closeCode];
    }
  }
});

delete fns['gray'];

var txt = 'ansi-html';

describe('chaining', function(){
  var keys = Object.keys(fns);
  for(var i = 0; i < keys.length * 5; i++) {
    var cKeys = _.sample(keys, _.random(1, 5));

    var ret = {};
    cKeys.forEach(function(key){
      var fn = fns[key];
      ret.ansi = fn.ansi(ret.ansi || txt);
      ret.html = fn.html(ret.html || txt);
    });

    it(cKeys.join('.'), function(){
      expect(ansiHTML(this.ansi)).to.equal(this.html);
    }.bind(ret));
  }
});