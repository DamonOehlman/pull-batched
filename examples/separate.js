const { pull, values, log } = require('pull-stream');
const { separate } = require('../');

pull(
  values([[1, 2], [3, 4], [5, 6]]),
  separate(),
  log()
);
