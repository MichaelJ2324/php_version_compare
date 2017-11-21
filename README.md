# php_version_compare
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Coverage](https://img.shields.io/badge/coverage-100%25-green.svg)](https://img.shields.io/badge/coverage-100%25-green.svg)

Compares two "PHP-standardized" version number strings.

[PHP.NET documentation](http://php.net/manual/en/function.version-compare.php) : "The function first replaces _, - and + with a dot . in the version strings and also inserts dots . before and after any non number so that for example '4.3.2RC1' becomes '4.3.2.RC.1'. Then it compares the parts starting from left to right. If a part contains special version strings these are handled in the following order: any string not found in this list < dev < alpha = a < beta = b < RC = rc < # < pl = p. This way not only versions with different levels like '4.1' and '4.1.2' can be compared but also any PHP specific version containing development state."

Written in pure JS. Passes the 700+ test cases of the standard PHP function source code.

Installing
-----------------------

```shell
npm install php_version_compare
```

Usage
-----------------------
__php_version_compare(version1, version2[, operator])__

### Parameters
* version1 : First version number.
* version2 : Second version number.
* operator : If the third optional operator argument is specified, test for a particular relationship. The possible operators are: <, lt, <=, le, >, gt, >=, ge, ==, =, eq, !=, <>, ne respectively.
This parameter is case-sensitive, values should be lowercase.

### Return value

By default, version_compare() returns -1 if the first version is lower than the second, 0 if they are equal, and 1 if the second is lower.

When using the optional operator argument, the function will return TRUE if the relationship is the one specified by the operator, FALSE otherwise.

### Example

```javascript
const versionCompare = require('php_version_compare')

console.log(versionCompare('1.11', '1.12')) // -1
console.log(versionCompare('1.11rc1', '1.11', 'lt')) // true
```

Author
------

[Guillaume Baudhuin](https://github.com/gbaudhuin)
