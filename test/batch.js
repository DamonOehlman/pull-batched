const { batch } = require('../');
const { pull, values, map, drain } = require('pull-stream');
const test = require('tape');

test('can successfully batch a synchronous source', t => {
  t.plan(4);
  pull(
    values([1, 2, 3, 4]),
    batch(2),
    drain(items => {
      t.ok(Array.isArray(items));
      t.equal(items.length, 2);
    })
  )
});
