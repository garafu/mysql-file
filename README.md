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


## Install

```
npm install mtsql-file
```

## Licence

[MIT](https://raw.githubusercontent.com/garafu/mysql-file/master/LICENSE)

## Author

[Akinari Tsugo](https://github.com/garafu)


