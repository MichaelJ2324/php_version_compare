/*
* Port of https://github.com/php/php-src/blob/master/ext/standard/versioning.c
*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory();
  } else {
    root.versionCompare = factory();
  }
}(this, function () {
  const specialForms = [
    {name: 'dev', order: 0},
    {name: 'alpha', order: 1},
    {name: 'a', order: 1},
    {name: 'beta', order: 2},
    {name: 'b', order: 2},
    {name: 'RC', order: 3},
    {name: 'rc', order: 3},
    {name: '#', order: 4},
    {name: 'pl', order: 5},
    {name: 'p', order: 5}
  ];

  const utils = {

    isdigit: function (char) {
      return char >= '0' && char <= '9';
    },
    isalnum: function (char) {
      return (char >= '0' && char <= '9') || (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    },
    isdig: function (x) {
      return this.isdigit(x) && (x !== '.');
    },
    isndig: function (x) {
      return !this.isdigit(x) && (x !== '.');
    },
    isspecialver: function (x) {
      return (x === '-') || (x === '_') || (x === '+');
    },
    strncmp: function (str1, str2, n) {
      str1 = str1.substring(0, n);
      str2 = str2.substring(0, n);
      const nested = (str1 > str2) ? 1 : -1;
      return (str1 === str2) ? 0 : nested;
    },
    estrdup: function (str) {
      return (' ' + str).slice(1);
    },
    phpCanonicalizeVersion: function (version) {
      var len = version.length;
      if (len === 0) {
        return '';
      }

      var i = 0;
      var lp = version[i++];
      var ret = lp;
      var p = version[i];
      while (p) {
        var lq = ret[i - 1];
        if (this.isspecialver(p)) {
          if (lq !== '.') {
            ret += '.';
          }
        } else if ((this.isndig(lp) && this.isdig(p)) || (this.isdig(lp) && this.isndig(p))) {
          if (lq !== '.') {
            ret += '.';
          }
          ret += p;
        } else if (!this.isalnum(p)) {
          if (lq !== '.') {
            ret += '.';
          }
        } else {
          ret += p;
        }
        lp = p;
        p = version[++i];
      }
      return ret;
    },
    compareSpecialVersionForms: function (form1, form2) {
      var self = this;
      var found1 = specialForms.find(function (pp) {
        return self.strncmp(form1, pp.name, pp.name.length) === 0;
      });

      found1 = typeof found1 == 'undefined' ? -1 : found1.order;

      var found2 = specialForms.find(function (pp) {
        return self.strncmp(form2, pp.name, pp.name.length) === 0;
      });
      found2 = typeof found2 == 'undefined' ? -1 : found2.order;

      const x = found1 - found2;
      const nested = (x < 0) ? -1 : 0;
      return (x > 0) ? 1 : nested;
    }
  }

  var versionCompareInternal = function (origVer1, origVer2) {
    var ver1 = '';
    var ver2 = '';
    var compare = 0;

    if (!origVer1 || !origVer2) {
      if (!origVer1 && !origVer2) {
        return 0;
      } else {
        return origVer1 ? 1 : -1;
      }
    }

    origVer1 = origVer1.trim();
    origVer2 = origVer2.trim();

    if (origVer1[0] === '#') {
      ver1 = utils.estrdup(origVer1);
    } else {
      ver1 = utils.phpCanonicalizeVersion(origVer1);
    }
    if (origVer2[0] === '#') {
      ver2 = utils.estrdup(origVer2);
    } else {
      ver2 = utils.phpCanonicalizeVersion(origVer2);
    }
    var v1 = ver1.split('.');
    var v2 = ver2.split('.');
    var i = 0
    while (i < v1.length && i < v2.length && compare === 0) {
      var p1 = v1[i];
      var p2 = v2[i];
      if (utils.isdigit(p1[0]) && utils.isdigit(p2[0])) {
        // compare element numerically
        const l1 = parseInt(p1);
        const l2 = parseInt(p2);
        const x = l1 - l2
        const nested = (x < 0) ? -1 : 0
        compare = (x > 0) ? 1 : nested
      } else if (!utils.isdigit(p1[0]) && !utils.isdigit(p2[0])) {
        // compare element names
        compare = utils.compareSpecialVersionForms(p1, p2);
      } else {
        // mix of names and numbers
        if (utils.isdigit(p1[0])) {
          compare = utils.compareSpecialVersionForms('#N#', p2);
        } else {
          compare = utils.compareSpecialVersionForms(p1, '#N#');
        }
      }
      i++
    }
    if (compare === 0) {
      if (i < v1.length) {
        var p1 = v1[i];
        if (utils.isdigit(p1[0])) {
          compare = 1;
        } else {
          compare = versionCompare(p1, '#N#');
        }
      } else if (i < v2.length) {
        var p2 = v2[i];
        if (utils.isdigit(p2[0])) {
          compare = -1;
        } else {
          compare = versionCompare('#N#', p2);
        }
      }
    }
    return compare;
  }

  var versionCompare = function (origVer1, origVer2, operator) {
    const compare = versionCompareInternal(origVer1, origVer2)
    if (!operator) {
      return compare;
    }
    if (operator === '<' || operator === 'lt') {
      return (compare === -1);
    }
    if (operator === '<=' || operator === 'le') {
      return (compare !== 1);
    }
    if (operator === '>' || operator === 'gt') {
      return (compare === 1);
    }
    if (operator === '>=' || operator === 'ge') {
      return (compare !== -1);
    }
    if (operator === '===' || operator === '==' || operator === '=' || operator === 'eq') {
      return (compare === 0);
    }
    if (operator === '!==' || operator === '!=' || operator === '<>' || operator === 'ne') {
      return (compare !== 0);
    }

    return null
  }

  return function () {
    this._utils = utils;
    this.compare = versionCompare;

    if (arguments.length > 0) {
      return this.compare.apply(null, arguments);
    }
    return this;
  }
}));