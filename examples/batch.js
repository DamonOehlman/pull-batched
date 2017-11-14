const { pull, values, log } = require('pull-stream');
const { batch } = require('../');

pull(
  values([1, 2, 3, 4, 5, 6]),
  batch(2),
  log()
);
