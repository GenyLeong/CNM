var fs = require('fs');
var del = require('del');
var copy = require('recursive-copy');
var replace = require('replace');

// Delete all public files
del(['./source/*']).then(paths => {
  console.log('Deleted files and folders:\n', paths.join('\n'));

  copyfile();
});

// Copy files from src to public
var copyfile = function(){

  // Source elements
  var options = {
    filter: [
      'css/**/*',
      'fonts/**/*',
      'data/*',
      // Images
      'img/woman.svg',
      'img/man.svg',
      'img/man-click.svg',
      'img/woman-click.svg',


      // JS vendor files
      'js/vendor/*.js',
      // Own javascript files
      'js/modules/*.js',
      'js/app.js',

      // HTML
      '!.DS_Store',
      '!README.html'
      // '!index.html'
    ],
  };
  copy('src', 'source/', options)
    .then(function(results) {
      console.info('Copied ' + results.length + ' files');
    })
    .catch(function(error) {
      console.error('Copy failed: ' + error);
    });

  // Index
  copy('src', 'source/')
    .then(function(results) {
      addSourcePath();
      console.info('Copied ' + results.length + ' files');
    })
    .catch(function(error) {
      console.error('Copy failed: ' + error);
    });

    var addSourcePath = function() {
      // Edit index.html
      replace({
        regex: 'js/',
        replacement: 'source/js/',
        paths: ['./index.html'],
        recursive: true,
        silent: true
      });
    };
  }
