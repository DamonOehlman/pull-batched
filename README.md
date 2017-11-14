# pull-batched

A simple [`pull-stream`](https://github.com/pull-stream/pull-stream) through that
can be used to batch or separate items in groups of items.

[![NPM](https://nodei.co/npm/pull-batched.png)](https://nodei.co/npm/pull-batched/)

[![Build Status](https://api.travis-ci.org/DamonOehlman/pull-batched.svg?branch=master)](https://travis-ci.org/DamonOehlman/pull-batched)

[![bitHound Score](https://www.bithound.io/github/DamonOehlman/pull-batched/badges/score.svg)](https://www.bithound.io/github/DamonOehlman/pull-batched)

## Example Usage

Items can be batched using the `batch` through.

```js
const { pull, values, log } = require('pull-stream');
const { batch } = require('pull-batch');

pull(
  values([1, 2, 3, 4, 5, 6]),
  batch(2),
  log()
);
```

Which generates the following output:

```
[ 1, 2 ]
[ 3, 4 ]
[ 5, 6 ]
```

And separated using the `separate` through:

```js
const { pull, values, log } = require('pull-stream');
const { separate } = require('pull-batch');

pull(
  values([[1, 2], [3, 4], [5, 6]]),
  separate(),
  log()
);
```

Which generates the output of digits 1 - 6 on individual lines.

## LICENSE

Copyright (c) 2017 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

