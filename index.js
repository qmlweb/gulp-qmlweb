var through2 = require('through2');
var filesystem = require('fs');
var istextorbinary = require('istextorbinary');
var xmlToJs = require('xml2js');
var mime = require('mime');
var parser = require('qmlweb-parser');

function dumpResource(root, filepath) {
  return new Promise(function(resolve, reject) {
    filesystem.readFile(root + '/' + filepath, function(err, buffer) {
      var data = null;
      var mimetype = mime.getType(filepath);
      var str = typeof buffer === "object" ? buffer.toString() : buffer;

      if (typeof str === "string") {
        try {
          if (filepath.match(/\.qml$/) != null)
            data = parser.qmlweb_parse(str, parser.qmlweb_parse.QMLDocument);
          else if (filepath.match(/\.m?js$/) != null)
            data = parser.qmlweb_jsparse(str);
          else if (istextorbinary.isBinary(filepath, buffer))
            data = "data:" + mimetype + ";base64," + buffer.toString('base64');
          else
            data = str;
          resolve(data);
        } catch (err) {
          reject(filepath + ': ' + err);
	}
      }
      else {
        console.warn("qrc: cannot open file", filepath, ':', err);
        reject(err);
      }
    });
  });
}

function addToQrc(qrc, directory, prefix, file) {
  var filepath = file._ ? file._ : file;
  var alias = file.$ && file.$.alias ? file.$.alias : filepath;
  var rcpath = prefix + '/' + alias;

  rcpath = rcpath.replace(/^\/+/, '');
  rcpath = rcpath.replace(/([^:]\/)\/+/g, "$1");
  return dumpResource(directory, filepath).then(function(result) {
    qrc[rcpath] = result;
  });
}

function generateQrcFromString(data, directory) {
  return new Promise(function(resolve, reject) {
    xmlToJs.parseString(data, function(err, result) {
      var qrc = {};
      var resourceLists = result.RCC ? result.RCC.qresource : [];
      var tasks = [];

      for (var resourceList of resourceLists) {
        var prefix = resourceList.$.prefix;
        var files = resourceList.file;

        for (var file of files)
          tasks.push(addToQrc(qrc, directory, prefix, file));
      }
      return Promise.all(tasks).then(function() {
        resolve(JSON.stringify(qrc));
      });
    });
  });
}

function generateQrc(path) {
  var directory = path.split('/').slice(0, -1).join('/');

  return new Promise(function(resolve, reject) {
    filesystem.readFile(path, function(err, data) {
      generateQrcFromString(data, directory).then(resolve);
    });
  });
}

module.exports = function(options) {
  function modifyFile(file, encoding, callback) {
    if (file.isNull()) return this.emit("data", file);
    if (file.isStream()) return this.emit('error', new Error("gulp-qml: Streaming not supported"));
    if (!options) options = {};

    var self      = this;
    var directory = file.path.split("/").slice(0, -1).join("/");
    var str       = file.contents.toString("utf8");
    var src       = options.src || "QmlWeb.QResource.registerResource({{object}});";

    return generateQrcFromString(str, directory).then(function(result) {
      file.contents = Buffer.from(src.replace("{{object}}", result));
      file.path = options.filename || "qrc.js";
      self.emit("data", file);
      callback();
    }).catch(function(error) {
      self.emit("error", new Error(file.path + ": " + error));
      callback();
    });
  }
  return through2.obj(modifyFile);
};
