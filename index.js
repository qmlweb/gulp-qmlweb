var es = require('event-stream');
var gutil = require('gulp-util');
var parser = require('qmlweb-parser');

module.exports = function (opt) {
  function modifyFile(file) {
    if (file.isNull()) return this.emit('data', file);
    if (file.isStream()) return this.emit('error', new Error("gulp-qml: Streaming not supported"));

    var data;
    var src;
    var str      = file.contents.toString('utf8');
    var dest     = gutil.replaceExtension(file.path, ".js");
    var gulpPath = __dirname.split('/');
        gulpPath = gulpPath.splice(0, gulpPath.length - 2).join('/') + '/';
    var path     = file.path.substr(gulpPath.length, file.path.length);

    try {
      if (file.path.match(/\.qml$/) != null)
        data = parser.qmlweb_parse(str, qmlweb_parse.QMLDocument);
      else if (file.path.match(/\.js$/) != null)
        data = parser.qmlweb_jsparse(str);
      else
        data = str;
    } catch (err) {
      return this.emit('error', new Error(file.path + ': ' + err));
    }

    src = "qrc['"+path+"'] = " + JSON.stringify(data) + ';';

    file.contents = new Buffer(src);
    file.path = dest;
    this.emit('data', file);
  }

  return es.through(modifyFile);
};
