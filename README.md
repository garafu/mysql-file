mysql-file
====

This module load MySQL SQL string from sql files.
Recursively reads SQL files that exist under the specified folder.

## Usage

```
const path = require("path");
const load = require("mysql-file").loadSync;
const SQL = load(path.join(__dirname, "./sql"));
```

## Install

```
npm install mtsql-file
```

## Licence

[MIT](https://github.com/garafu/tool/blob/master/LICENCE)

## Author

[Akinari Tsugo](https://github.com/garafu)


