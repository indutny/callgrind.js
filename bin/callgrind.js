#!/usr/bin/env node
var fs = require('fs'),
    callgrind = require('..'),
    argv = require('optimist')
        .usage('Usage: $0 --clog callgrind.pid --vlog v8.log')
        .demand(['clog', 'vlog'])
        .argv;


callgrind.process({
  vlog: fs.readFileSync(argv.vlog).toString(),
  clog: fs.readFileSync(argv.clog).toString(),
  out: process.stdout
})
