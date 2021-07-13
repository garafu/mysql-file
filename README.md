mysql-fileloader
====

This module load MySQL SQL string from sql files.
Recursively reads SQL files that exist under the specified folder.

## Install

```
npm install @garafu/mysql-fileloader
```

or

```
yarn add @garafu/mysql-fileloader
```

## Usage

When read the required SQL string from specified file each time.

```
const path = require("path");
const root = path.join(__dirname, "./sql");
const { sql } = require("@garafu/mysql-fileloader")({ root });

(async () => {
  console.log(await sql("SELECT_USER_BY_ID")); // <-- "SELECT * FROM user WHERE id=?"
})();
```

When reading synchronously all SQL files from under specified folder.

```
const path = require("path");
const SQL = require("mysql-file").loadSync(path.join(__dirname, "./sql"));

console.log(SQL["SELECT_USER_BY_ID"]); // <-- "SELECT * FROM user WHERE id=?"
```

## Documents

* function
  * `function init([options]): void`
  * `function sql(name): Promise<string>`
  * `function loadSync(root [, options]): SQL`
  * `function loadAsync(root [, options]): SQL`

### function

_`function init([options]): void`_

Initialize SqlFileLoader.

**arguments**
* options
    * root  {string}  Root directory path of loading SQL files.

**returns**

This module object.

_`function sql(name): Promise<string>`_

Load SQL string from specified file asyncnously.

**arguments**
* name  {string}  SQL file name.

**returns**
`Promise<string>` SQL string

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


## Licence

[MIT](https://raw.githubusercontent.com/garafu/mysql-file/master/LICENSE)

## Author

[Akinari Tsugo](https://github.com/garafu)


