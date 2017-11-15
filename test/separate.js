const { separate } = require('../');
const { pull, values, map, asyncMap, drain, onEnd } = require('pull-stream');
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

test('can successfully separate an asynced stream', t => {
  let expectedValue = 1;

  t.plan(4);
  pull(
    values([[1, 2], [3, 4]]),
    asyncMap((data, callback) => {
      setTimeout(() => callback(false, data), Math.floor(Math.random() * 200));
    }),
    separate(),
    drain(value => {
      t.equal(value, expectedValue);
      expectedValue += 1;
    })
  )
});

test('ensure separating results in a single end call', t => {
  t.plan(1);
  pull(
    values([[1, 2], [3, 4]]),
    separate(),
    onEnd(() => {
      t.pass('received an end signal');
    })
  )
});
