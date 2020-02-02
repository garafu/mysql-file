const fs = require("fs");
const path = require("path");

/**
 * Create option object.
 * @returns {object}  Optioin object.
 */
var setOptions = function (options = {}) {
  options.getValueOrDefault = function (key, value) {
    return key in this ? this[key] : value;
  };
  return {
    recurse: options.getValueOrDefault("recurse", true)
  };
};

/**
 * Whethere the file is sql or not.
 * @param {string} filename file name.
 * @returns {boolean} Is sql file or not.
 */
var isTargetFile = function (filename) {
  return /.+\.sql/i.test(filename || "");
};

/**
 * Trim empty spaces and return codes.
 * @param {string} text SQL string.
 * @returns {string}  trimed sql string.
 */
var format = function (text) {
  return (text || "").replace(/\s+/g, " ");
};

var loadSync = function (root, options) {
  var filelist = {};

  options = setOptions(options);

  var items = fs.readdirSync(root, { withFileTypes: true });
  
  for (var item of items) {
    var fullpath = path.join(root, item.name);
    if (options.recurse && item.isDirectory()) {
      var obj = loadSync(fullpath, options) || {};
      filelist = Object.assign(filelist, obj);
    } else if (isTargetFile(item.name)) {
      var name = path.basename(item.name, path.extname(item.name));
      var data = fs.readFileSync(fullpath, "utf-8");
      filelist[name] = format(data);
    }
  }

  return filelist;
};

var loadAsync = function (root, options) {
  options = setOptions(options);

  return new Promise((resolve, reject) => {
    fs.readdir(root, { withFileTypes: true }, (error, items) => {
      if (error) {
        reject(error);
        return;
      }

      var promises = [];

      for (var item of items) {
        var fullpath = path.join(root, item.name);
        if (options.recurse && item.isDirectory()) {
          promises[promises.length] = loadAsync(fullpath, options);
        } else if (isTargetFile(item.name)) {
          promises[promises.length] = new Promise((resolve, reject) => {
            var name = path.basename(item.name, path.extname(item.name));
            fs.readFile(fullpath, "utf-8", (error, data) => {
              if (error) {
                reject(error);
                return;
              }
              resolve({ name, data });
            });
          });
        }
      }

      Promise.all(promises).then((results) => {
        var filelist = {};
        for (var item of results) {
          filelist[item.name] = format(item.data);
        }
        resolve(filelist);
      }).catch((error) => {
        reject(error);
      });
    });

  });
};

module.exports = { loadAsync, loadSync };