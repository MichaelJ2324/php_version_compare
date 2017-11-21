const assert = require('assert')
const fs = require('fs')
const utils = require('../utils')
const versionCompare = require('../index')
const describe = require('mocha').describe // avoid eslint warnings
const it = require('mocha').it // avoid eslint warnings

const content = fs.readFileSync('./test/compare.txt', 'UTF-8').split('\n').filter(Boolean)
const contentOperators = fs.readFileSync('./test/operators.txt', 'UTF-8').split('\n').filter(Boolean)

describe('phpCanonicalizeVersion', function () {
  it('return empty string on 0 length version', function () {
    assert.equal(utils.phpCanonicalizeVersion(''), '')
  })

  it('transforms 4.3.5RC1 to 4.3.5.RC.1', function () {
    assert.equal(utils.phpCanonicalizeVersion('4.3.5RC1'), '4.3.5.RC.1')
  })

  it('transforms 4.3.5RC1+ to 4.3.5.RC.1.', function () {
    assert.equal(utils.phpCanonicalizeVersion('4.3.5RC1+'), '4.3.5.RC.1.')
  })

  it('transforms 4.3_5RC1 to 4.3.5.RC.1', function () {
    assert.equal(utils.phpCanonicalizeVersion('4.3_5RC1'), '4.3.5.RC.1')
  })

  it('transforms 1.0-dev to 1.0.dev', function () {
    assert.equal(utils.phpCanonicalizeVersion('1.0-dev'), '1.0.dev')
  })
})

describe('compareSpecialVersionForms', function () {
  it('case 1', function () {
    assert.equal(utils.compareSpecialVersionForms('beta', 'RC'), -1)
    assert.equal(utils.compareSpecialVersionForms('rc', 'RC'), 0)
    assert.equal(utils.compareSpecialVersionForms('RC', 'alpha'), 1)
  })
})

describe('version_compare', function () {
  for (let l of content) {
    it(l + ' is true', function () {
      let e = l.match(/([\w\.\_\-]+)\s+([=\<\>])\s+([\w\.\_\-]+)/)
      let v1 = e[1]
      let v2 = e[3]
      let expected = -1
      if (e[2] === '=') {
        expected = 0
      } else if (e[2] === '>') {
        expected = 1
      }
      assert.equal(versionCompare(v1, v2), expected)
    })
  }

  it('compares weird cases correctly', function () {
    assert.equal(versionCompare('1.pl1', '1-.dev'), 1)
    assert.equal(versionCompare('1.pl1', '1.-dev'), 1)
    assert.equal(versionCompare(null, null), 0)
    assert.equal(versionCompare(), 0)
    assert.equal(versionCompare('1.0'), 1)
    assert.equal(versionCompare(null, '1.0'), -1)
    assert.equal(versionCompare('1d.0', '1.0'), -1)
    assert.equal(versionCompare('1.0', '1d.0'), 1)
    assert.equal(versionCompare('2.0', '1.0', 'h'), null)
    assert.equal(versionCompare('1.0.1', '1.0'), 1)
    assert.equal(versionCompare('1.0', '1.0.1'), -1)
    assert.equal(versionCompare('1.11rc1', '1.11', 'lt'), true)
  })
})

describe('version_operators', function () {
  for (let l of contentOperators) {
    it(l + ' is true', function () {
      let e = l.match(/([\w\.\_\-]+)\s+([=\!\<\>ltgeqn]+)\s+([\w\.\_\-]+)\s+:\s(true|false)/)
      let v1 = e[1]
      let v2 = e[3]
      let op = e[2]
      let b = (e[4] === 'true')
      assert.equal(versionCompare(v1, v2, op), b)
    })
  }
})