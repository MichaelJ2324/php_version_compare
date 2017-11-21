/*
* Port of https://github.com/php/php-src/blob/master/ext/standard/versioning.c
*/
const utils = require('./utils')

let versionCompareInternal = function (origVer1, origVer2) {
  let ver1 = ''
  let ver2 = ''
  let compare = 0

  if (!origVer1 || !origVer2) {
    if (!origVer1 && !origVer2) {
      return 0
    } else {
      return origVer1 ? 1 : -1
    }
  }

  origVer1 = origVer1.trim()
  origVer2 = origVer2.trim()

  if (origVer1[0] === '#') {
    ver1 = utils.estrdup(origVer1)
  } else {
    ver1 = utils.phpCanonicalizeVersion(origVer1)
  }
  if (origVer2[0] === '#') {
    ver2 = utils.estrdup(origVer2)
  } else {
    ver2 = utils.phpCanonicalizeVersion(origVer2)
  }
  let v1 = ver1.split('.')
  let v2 = ver2.split('.')
  let i = 0
  while (i < v1.length && i < v2.length && compare === 0) {
    let p1 = v1[i]
    let p2 = v2[i]
    if (utils.isdigit(p1[0]) && utils.isdigit(p2[0])) {
      // compare element numerically
      const l1 = parseInt(p1)
      const l2 = parseInt(p2)
      const x = l1 - l2
      const nested = (x < 0) ? -1 : 0
      compare = (x > 0) ? 1 : nested
    } else if (!utils.isdigit(p1[0]) && !utils.isdigit(p2[0])) {
      // compare element names
      compare = utils.compareSpecialVersionForms(p1, p2)
    } else {
      // mix of names and numbers
      if (utils.isdigit(p1[0])) {
        compare = utils.compareSpecialVersionForms('#N#', p2)
      } else {
        compare = utils.compareSpecialVersionForms(p1, '#N#')
      }
    }
    i++
  }
  if (compare === 0) {
    if (i < v1.length) {
      let p1 = v1[i]
      if (utils.isdigit(p1[0])) {
        compare = 1
      } else {
        compare = versionCompare(p1, '#N#')
      }
    } else if (i < v2.length) {
      let p2 = v2[i]
      if (utils.isdigit(p2[0])) {
        compare = -1
      } else {
        compare = versionCompare('#N#', p2)
      }
    }
  }
  return compare
}

let versionCompare = function (origVer1, origVer2, operator) {
  const compare = versionCompareInternal(origVer1, origVer2)
  if (!operator) {
    return compare
  }
  if (operator === '<' || operator === 'lt') {
    return (compare === -1)
  }
  if (operator === '<=' || operator === 'le') {
    return (compare !== 1)
  }
  if (operator === '>' || operator === 'gt') {
    return (compare === 1)
  }
  if (operator === '>=' || operator === 'ge') {
    return (compare !== -1)
  }
  if (operator === '===' || operator === '==' || operator === '=' || operator === 'eq') {
    return (compare === 0)
  }
  if (operator === '!==' || operator === '!=' || operator === '<>' || operator === 'ne') {
    return (compare !== 0)
  }

  return null
}

module.exports = versionCompare