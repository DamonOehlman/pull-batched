const { batch } = require('../');
const { pull, values, map, asyncMap, take, drain, onEnd } = require('pull-stream');
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

test('can successfully batch an asynced stream', t => {
  t.plan(4);
  pull(
    values([1, 2, 3, 4]),
    asyncMap((data, callback) => {
      setTimeout(() => callback(false, data), Math.floor(Math.random() * 200));
    }),
    batch(2),
    drain(items => {
      t.ok(Array.isArray(items));
      t.equal(items.length, 2);
    })
  )
});

test('correctly batches an ended stream (e.g. using take)', t => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  t.plan(6);
  pull(
    values(items.slice()),
    take(5),
    batch(2),
    drain(batched => {
      t.ok(Array.isArray(batched));
      t.deepEqual(items.splice(0, batched.length), batched)
    })
  )
});

test('correctly batches an async, ended stream (e.g. using take)', t => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  t.plan(6);
  pull(
    values(items.slice()),
    take(5),
    asyncMap((data, callback) => {
      setTimeout(() => callback(false, data), Math.floor(Math.random() * 200));
    }),
    batch(2),
    drain(batched => {
      t.ok(Array.isArray(batched));
      t.deepEqual(items.splice(0, batched.length), batched)
    })
  )
});

test('ensure batch throws an exception if not provided a count', t => {
  t.plan(1);
  t.throws(() => {
    pull(
      values([1, 2, 3, 4]),
      batch(),
      log()
    );
  });
});

test('ensure batch throws an exception if provided a non-numeric value for count', t => {
  t.plan(1);
  t.throws(() => {
    pull(
      values([1, 2, 3, 4]),
      batch({}),
      log()
    );
  });
});

test('ensure batching results in a single end call', t => {
  t.plan(1);
  pull(
    values([1, 2, 3, 4]),
    batch(2),
    onEnd(() => {
      t.pass('received an end signal');
    })
  )
});
