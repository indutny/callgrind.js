var assert = require('assert'),
    callgrind = require('..');

describe('SplayTree', function() {
  var tree;
  beforeEach(function() {
    tree = new callgrind.SplayTree(function(a, b) {
      return a- b;
    });
  });

  afterEach(function() {
    tree = null;
  });

  it('should find item after insertion', function() {
    tree.insert(1, 1);
    assert.equal(tree.find(1), 1);
  });

  it('should find items after multiple ordered insertions', function() {
    var n = 1000;
    for (var i = 0; i < n; i++) {
      tree.insert(i, i);
    }
    for (var i = 0; i < n; i++) {
      assert.equal(tree.find(i), i);
    }
  });

  it('should find items after multiple random insertions', function() {
    var n = 1000,
        list = [];

    for (var i = 0; i < n; i++) {
      list.splice(~~(Math.random() * n), 0, i);
    }

    for (var i = 0; i < n; i++) {
      tree.insert(list[i], list[i]);
    }

    for (var i = 0; i < n; i++) {
      assert.equal(tree.find(list[i]), list[i]);
    }
  });

  it('should find items after multiple random insertions and gaps', function() {
    var n = 1000,
        list = [];

    for (var i = 0; i < n; i++) {
      list.splice(~~(Math.random() * n), 0, i);
    }

    for (var i = 0; i < n; i++) {
      tree.insert(list[i] - 0.5, list[i]);
    }

    for (var i = 0; i < n; i++) {
      assert.equal(tree.find(list[i]), list[i]);
    }
  });
});
