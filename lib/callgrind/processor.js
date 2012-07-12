var callgrind = require('../callgrind');

exports.process = function process(options) {
  var tree = new callgrind.SplayTree(function(a, b) {
    return a < b ? -1 : a === b ? 0 : 1;
  });

  options.vlog.split(/\n/g).map(function(line) {
    return line.split(/,/g);
  }).filter(function(line) {
    return line[0] === 'code-creation';
  }).forEach(function(line) {
    var start = parseInt(line[2], 16),
        comment = /^".*"$/.test(line[4]) ? JSON.parse(line[4]) : line[4],
        match = comment.match(/^(.*)\s(.*:\d+)$/),
        data = {
          start: start,
          end: start + parseInt(line[3], 10)
        };

    if (match) {
      data.filename = match[2];
      data.comment = match[1];
    } else {
      data.filename = line[1];
      data.comment = comment;
    }

    tree.insert(start, data);
  });

  var clines = options.clog.split(/\n/g);

  // Replace all cfn=(...) 0x... to comments
  clines = clines.map(function(line) {
     return line.replace(/(c?)fn=\((\d+)\) (0x[0-9a-z]+)/,
                                   function(all, c, cfn, hex) {
      var ip = parseInt(hex, 16),
          data = tree.find(ip);

      if (!data || ip < data.start || data.end < ip) return all;

      return c + 'fn=(' + cfn + ') ' + data.comment + ' (' + data.filename + ')';
    });
  });

  options.out.write(clines.join('\n'));
};
