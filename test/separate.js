const { separate } = require('../');
const { pull, values, map, drain } = require('pull-stream');
const test = require('tape');

test('can successfully separate a synchronous source', t => {
  let expectedValue = 1;

  t.plan(4);
  pull(
    values([[1, 2], [3, 4]]),
    separate(),
    drain(value => {
      t.equal(value, expectedValue);
      expectedValue += 1;
    })
  )
});
