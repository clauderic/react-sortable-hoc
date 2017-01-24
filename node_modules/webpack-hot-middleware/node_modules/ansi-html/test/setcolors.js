var ansiHTML = require('../'),
  chalk = require('chalk'),
  chai = require('chai'),
  expect = chai.expect,
  should = chai.should();

var fns = {};
Object.keys(chalk.styles).forEach(function (key) {
  var openCode = chalk.styles[key].open.match(/\u001b\[(\d+)m/)[1],
    closeCode = chalk.styles[key].close.match(/\u001b\[(\d+)m/)[1],
    openTag = ansiHTML.tags.open[openCode];

  fns[key] = {
    ansi: function (txt) {
      return chalk[key](txt)
    },
    html: function (txt) {
      return (openTag[0] == '<' ? openTag : ('<span style="' + openTag + ';">')) + txt + ansiHTML.tags.close[closeCode];
    }
  }
});
delete fns['gray'];

var txt = 'ansi-html';

describe('set default / inverse colors', function () {
  describe('when a hex string is being passed in', function () {
    before(function () {
      ansiHTML.setColors({
        'reset': 'ccc'
      });
    });

    after(function () {
      ansiHTML.reset();
    });

    it('foregroud && background color should be set correctly', function () {
      var result = ansiHTML(fns['reset'].ansi(txt));
      expect(result).to.contain('color:#ccc');
      expect(result).to.contain('background:#000');
      result = ansiHTML(fns['inverse'].ansi(txt));
      expect(result).to.contain('background:#ccc');
      expect(result).to.contain('color:#000');
    });
  });

  describe('when an array(with single string item) is being passed in', function () {
    before(function () {
      ansiHTML.setColors({
        'reset': ['ccc']
      });
    });

    after(function () {
      ansiHTML.reset();
    });

    it('foregroud && background color should be set correctly', function () {
      var result = ansiHTML(fns['reset'].ansi(txt));
      expect(result).to.contain('color:#ccc');
      expect(result).to.contain('background:#000');
      result = ansiHTML(fns['inverse'].ansi(txt));
      expect(result).to.contain('background:#ccc');
      expect(result).to.contain('color:#000');
    });
  });

  describe('when an array(with non-string item) is being passed in', function () {
    it('an error should be caught', function () {
      try {
        ansiHTML.setColors({
          'reset': [true]
        });
      } catch (err) {
        should.exist(err);
      }
    });
  });

  describe('when an array(with single string item) is being passed in', function () {
    before(function () {
      ansiHTML.setColors({
        'reset': [,'ccc']
      });
    });

    after(function () {
      ansiHTML.reset();
    });

    it('foregroud && background color should be set correctly', function () {
      var result = ansiHTML(fns['reset'].ansi(txt));
      expect(result).to.contain('background:#ccc');
      expect(result).to.contain('color:#fff');
      result = ansiHTML(fns['inverse'].ansi(txt));
      expect(result).to.contain('color:#ccc');
      expect(result).to.contain('background:#fff');
    });
  });

  describe('when an array is being passed in', function () {
    before(function () {
      ansiHTML.setColors({
        'reset': ['ddd','ccc']
      });
    });

    after(function () {
      ansiHTML.reset();
    });

    it('foregroud && background color should be set correctly', function () {
      var result = ansiHTML(fns['reset'].ansi(txt));
      expect(result).to.contain('background:#ccc');
      expect(result).to.contain('color:#ddd');
      result = ansiHTML(fns['inverse'].ansi(txt));
      expect(result).to.contain('color:#ccc');
      expect(result).to.contain('background:#ddd');
    });
  });
});


describe('set other colors', function () {
	describe('when a non-string is being passed in', function () {
    it('an error should be caught', function () {
      try {
        ansiHTML.setColors({
          'black': true
        });
      } catch (err) {
        should.exist(err);
      }
    });
  });

  describe('when strings are being passed in', function () {
  	var colors = {
      reset: ['555', '666'],
		  black: 'aaa',
		  red: 'bbb',
		  green: 'ccc',
		  yellow: 'ddd',
		  blue: 'eee',
		  magenta: 'fff',
		  cyan: '999',
		  lightgrey: '888',
		  darkgrey: '777'
    };
  	before(function () {
      ansiHTML.setColors(colors);
    });

    after(function () {
      ansiHTML.reset();
    });

    it('everything goes fine', function () {
      var result = ansiHTML(fns['reset'].ansi(txt));
      expect(result).to.contain('background:#666');
      expect(result).to.contain('color:#555');
      result = ansiHTML(fns['inverse'].ansi(txt));
      expect(result).to.contain('color:#666');
      expect(result).to.contain('background:#555');

      for(var key in colors){
      	if(key == 'reset'){
      		continue;
      	}
	      result = ansiHTML(fns[!!~key.indexOf('grey') ? 'grey' : key].ansi(txt));
	      expect(result).to.contain('color:#' + colors[!!~key.indexOf('grey') ? 'darkgrey' : key]);
			}
    });
  });
});
