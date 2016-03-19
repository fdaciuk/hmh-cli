#!/usr/bin/env node

'use strict'

const hmh = require('hmh')
const pkg = require('./package.json')
const hmhPkg = require('hmh/package.json')
const args = process.argv.slice(2)

const help = `
  Usage:
    $ hmh <option> <time> <output>

  Options:
    -h, --help                           Show this help
    -v, --version                        Show hmh and hmh-cli version
    +, --sum <time>                      Calculate hours, summing time spaces
    -, --sub <time>                      Calculate hours, subtracting time spaces
    %, --diff <firstTime> <SecondTime>   Calculate the difference between two time spaces
    /, --div <time> <divisor>            Divide a time space into a number, passed as 'divisor'.

  Example
    $ hmh --sum 10m 20m 30m 1h 25m
    2h 25m

    $ hmh --sub 10h 20m 1m
    9h 39m

    $ hmh --diff "10h 30m" "12h"
    1h 30m

    $ hmh --diff 10h30m 12h
    1h 30m

    $ hmh --div 9h 3
    3h
`

const version = `
  hmh: ${hmhPkg.version}
  hmh-cli: ${pkg.version}
`

const getOutput = (argv) => {
  return argv[argv.length - 1]
}

const getMethod = (argv) => {
  if (!argv[0]) {
    return new Error()
  }
  let option = argv[0]
  if (option.length > 1) {
    option = option.replace(/--?/, '')
  }
  return {
    '+': 'sum',
    '-': 'sub',
    '/': 'div',
    '%': 'diff'
  }[option] || option
}

const getValues = (argv) => {
  if (getMethod(argv) === 'diff' || getMethod(argv) === 'div') {
    return argv.slice(1)
  }
  return argv.filter((value) => value.match(/\d+[hm]/))
}

const method = getMethod(args)
const values = getValues(args)
const output = getOutput(args)

try {
  switch (method) {
    case 'v':
    case 'version':
      console.log(version)
      break

    case 'diff':
    case 'div':
      console.log(hmh[method](values[0], values[1], output).toString())
      break

    default:
      console.log(hmh[method](values, output).toString())
  }
} catch (e) {
  console.log(help)
}
