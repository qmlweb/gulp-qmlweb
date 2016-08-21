## A Gulp plugin to produce pre-parsed assets for [QmlWeb](https://github.com/qmlweb/qmlweb)

[![Join the chat at https://gitter.im/qmlweb/qmlweb](https://badges.gitter.im/qmlweb/qmlweb.svg)](https://gitter.im/qmlweb/qmlweb)

[![npm](https://img.shields.io/npm/v/gulp-qmlweb.svg)](https://www.npmjs.com/package/gulp-qmlweb)
[![GitHub tag](https://img.shields.io/github/tag/qmlweb/gulp-qmlweb.svg)](https://github.com/qmlweb/gulp-qmlweb/releases)

## Installation

Add the following dependencies to your `package.json`:

```js
{
  "name": "QmlWebProject",
  "devDependencies": {
    "gulp": "~3.6.0",
    "gulp-concat": "~2.1.7",
    "gulp-qmlweb": "~0.0.7"
  }
}
```

## Usage
```js
var qml = require('gulp-qmlweb');
var concat = require('gulp-concat');

function myPathFilter(path) {
    return "/mynamespace/" + path;
}

gulp.task('scripts', function() {
  return gulp.src(['qml/**/*.qml', 'qml/**/*.js', 'qml/**/qmldir'])
    .pipe(qml({pathFilter: myPathFilter}))
    .pipe(concat('qrc.js'))
    .pipe(gulp.dest('./dist/'));
});
```

This will compile all your QML sources (qml and javascript) and concatenate them in the `/dist/qrc.js` file.
