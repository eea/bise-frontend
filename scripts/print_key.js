#!/usr/bin/env node

/*
 * Prints array values from a given key in package.json
 */

const pkg = require('../package.json');

const name = process.argv[2];

const values = pkg[name] || [];

console.log(values.join(' '));
