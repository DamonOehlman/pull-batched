const { batch, separate } = require('../');
const { pull, values, map, asyncMap, take, drain, onEnd, collect } = require('pull-stream');
const test = require('tape');

test('successfully batch and separate a synchronous source', t => {
  t.plan(2);
  pull(
    values([1, 2, 3, 4]),
    batch(2),
    separate(),
    collect((err, items) => {
      t.error(err);
      t.deepEqual(items, [1, 2, 3, 4]);
    })
  )
});

test('successfully batch and separate an asynced stream (upstream)', t => {
  t.plan(2);
  pull(
    values([1, 2, 3, 4]),
    asyncMap((data, callback) => {
      setTimeout(() => callback(false, data), Math.floor(Math.random() * 200));
    }),
    batch(2),
    separate(),
    collect((err, items) => {
      t.error(err);
      t.deepEqual(items, [1, 2, 3, 4]);
    })
  )
});

test('successfully batch and separate an asynced stream (downstream)', t => {
  t.plan(2);
  pull(
    values([1, 2, 3, 4]),
    batch(2),
    separate(),
    asyncMap((data, callback) => {
      setTimeout(() => callback(false, data), Math.floor(Math.random() * 200));
    }),
    collect((err, items) => {
      t.error(err);
      t.deepEqual(items, [1, 2, 3, 4]);
    })
  )
});

test('can successfully batch and separate an asynced stream (upstream + downstream)', t => {
  t.plan(2);
  pull(
    values([1, 2, 3, 4]),
    asyncMap((data, callback) => {
      setTimeout(() => callback(false, data), Math.floor(Math.random() * 200));
    }),
    batch(2),
    separate(),
    asyncMap((data, callback) => {
      setTimeout(() => callback(false, data), Math.floor(Math.random() * 200));
    }),
    collect((err, items) => {
      t.error(err);
      t.deepEqual(items, [1, 2, 3, 4]);
    })
  )
});

test('can successfully batch and separate an asynced stream (everywhere!!!)', t => {
  t.plan(2);
  pull(
    values([1, 2, 3, 4]),
    asyncMap((data, callback) => {
      setTimeout(() => callback(false, data), Math.floor(Math.random() * 200));
    }),
    batch(2),
    asyncMap((data, callback) => {
      setTimeout(() => callback(false, data), Math.floor(Math.random() * 200));
    }),
    separate(),
    asyncMap((data, callback) => {
      setTimeout(() => callback(false, data), Math.floor(Math.random() * 200));
    }),
    collect((err, items) => {
      t.error(err);
      t.deepEqual(items, [1, 2, 3, 4]);
    })
  )
});

test('correctly batches and separates ended stream (e.g. using take)', t => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  t.plan(2);
  pull(
    values(items.slice()),
    take(5),
    batch(2),
    separate(),
    collect((err, output) => {
      t.error(err);
      t.deepEqual(output, items.slice(0, output.length))
    })
  )
});
