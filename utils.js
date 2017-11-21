let isdigit = function (char) {
  return char >= '0' && char <= '9'
}
module.exports.isdigit = isdigit

function isalnum(char) {
  return (char >= '0' && char <= '9') || (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
}

function isdig(x) {
  return isdigit(x) && (x !== '.')
}

function isndig(x) {
  return !isdigit(x) && (x !== '.')
}

function isspecialver(x) {
  return (x === '-') || (x === '_') || (x === '+')
}

function strncmp(str1, str2, n) {
  str1 = str1.substring(0, n)
  str2 = str2.substring(0, n)
  const nested = (str1 > str2) ? 1 : -1
  return (str1 === str2) ? 0 : nested
}

let estrdup = function (str) {
  return (' ' + str).slice(1)
}
module.exports.estrdup = estrdup

let phpCanonicalizeVersion = function (version) {
  let len = version.length
  if (len === 0) {
    return ''
  }

  let i = 0
  let lp = version[i++]
  let ret = lp
  let p = version[i]
  while (p) {
    let lq = ret[i - 1]
    if (isspecialver(p)) {
      if (lq !== '.') {
        ret += '.'
      }
    } else if ((isndig(lp) && isdig(p)) || (isdig(lp) && isndig(p))) {
      if (lq !== '.') {
        ret += '.'
      }
      ret += p
    } else if (!isalnum(p)) {
      if (lq !== '.') {
        ret += '.'
      }
    } else {
      ret += p
    }
    lp = p
    p = version[++i]
  }
  return ret
}

module.exports.phpCanonicalizeVersion = phpCanonicalizeVersion

let compareSpecialVersionForms = function (form1, form2) {
  let found1 = -1
  let found2 = -1
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
  ]

  for (let pp of specialForms) {
    if (strncmp(form1, pp.name, pp.name.length) === 0) {
      found1 = pp.order;
      break;
    }
  }

  for (let pp of specialForms) {
    if (strncmp(form2, pp.name, pp.name.length) === 0) {
      found2 = pp.order;
      break;
    }
  }

  const x = found1 - found2
  const nested = (x < 0) ? -1 : 0
  return (x > 0) ? 1 : nested
}

module.exports.compareSpecialVersionForms = compareSpecialVersionForms