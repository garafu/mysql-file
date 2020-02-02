mysql-file
====

This module load MySQL SQL string from sql files.
Recursively reads SQL files that exist under the specified folder.

## Usage

When reading synchronously.

```
const path = require("path");
const load = require("mysql-file").loadSync;
const SQL = load(path.join(__dirname, "./sql"));
```

When reading asynchronously.

```
const path = require("path");
const load = require("mysql-file").loadAsync;
(async function (){
  const SQL = await load(path.join(__dirname, "./sql"));
})();
```
## Documents

* function
  * `function loadSync(root, options): SQL`
  * `function loadAsync(root, options): SQL`
* options
  * `recursive`
* returns
  * `SQL`

### function
_`function loadSync(root, options): SQL`_

Load sql string syncronously from sql files under the specified folder.

**arguments**
* root {string} Start directory for searching sql files.
* options {object} See options section.

**returns**

_`function loadAsync(root, options): SQL`_

Load sql string *asyncronously* from sql files under the specified folder.

**arguments**
* root {string} Start directory for searching sql files.
* options {object} See options section.

**returns**


### options

* _`recursive` {boolean}_ : Whether you want to recoursive search or not.

### returns
_`SQL`_

Return value is object that includes key which is file name and value which is sql string.

## Install

```
npm install mtsql-file
```

## Licence

[MIT](https://raw.githubusercontent.com/garafu/mysql-file/master/LICENSE)

## Author

[Akinari Tsugo](https://github.com/garafu)


