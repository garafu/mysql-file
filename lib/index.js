const EXT = ".sql";
const fs = require("fs");
const path = require("path");

/**
 * @typedef {object}  SqlFileLoaderOptions
 * @property  {string}  root  Root directory path.
 */
var config = {
  root: path.join(process.cwd(), "./sql")
};

/**
 * 
 */
var _cache = {};

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
  return /.+\.sql$/i.test(filename || "");
};

/**
 * Trim comments and empty spaces and return codes.
 * @param {string} text SQL string.
 * @returns {string}  trimed sql string.
 */
var format = function (text = "") {
  // Remove comment line.
  text = text.replace(/\-\- .*/g, "");
  text = text.replace(/\/\*[\s\S]*?\*\//mg, "");
  // Remove spaces.
  text = text.replace(/\s+/g, " ").trim()
  return text;
};

var tryStat = function (path) {
  try {
    return fs.statSync(path);
  } catch (err) {
    return undefined;
  }
};

var resolve = function (dir, file) {
  var filepath, stat;

  // <dir>/<file>
  filepath = path.join(dir, file);
  stat = tryStat(filepath);
  if (stat && stat.isFile()) {
    return filepath;
  }

  // <dir>/<file><ext>
  filepath = path.join(dir, file + EXT);
  stat = tryStat(filepath);
  if (stat && stat.isFile()) {
    return filepath;
  }
};

/**
 * Load sql files from specified folder.
 * @param {string} root Start directory.
 * @param {object} options Loading options.
 * @returns {object} Loaded sql strings.
 */
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

/**
 * Load sql files from specified folder.
 * @param {string} root Start directory.
 * @param {object} options Loading options.
 * @returns {Promise} Called when loaded sql files.
 */
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

/**
 * Initialize SqlFileLoader.
 * @param {SqlFileLoaderOptions} options 
 * @returns {SqlFileLoader}
 */
var SqlFileLoader = function (options = {}) {
  SqlFileLoader.init(options);
  return SqlFileLoader;
};

/**
 * Initialize SqlFileLoader.
 * @param {SqlFileLoaderOptions} options 
 */
SqlFileLoader.init = function (options = {}) {
  config.root = options.root ? path.resolve(options.root) : config.root;
};

/**
 * Load specified SQL string from file.
 * @param {string} name SQL file name
 * @returns SQL string
 */
SqlFileLoader.sql = function (name) {
  if (_cache[name]) {
    return _cache[name];
  }

  // Get filepath.
  var loc = path.resolve(config.root, name);
  var dir = path.dirname(loc);
  var file = path.basename(loc);
  var filepath = resolve(dir, file);

  // Load SQL file
  var text = fs.readFileSync(filepath, "utf-8");
  _cache[name] = format(text);

  return _cache[name];
};

SqlFileLoader.loadAsync = loadAsync;
SqlFileLoader.loadSync = loadSync;

module.exports = SqlFileLoader;