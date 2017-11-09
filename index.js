const createDebugger = require('debug');

/**
  # pull-batch

  A simple [`pull-stream`](https://github.com/pull-stream/pull-stream) through that
  can be used to batch or separate items in groups of items.
**/

function batch(count) {
  const debug = createDebugger('pull-stream:batch');

  return function(read) {
    // initialise the buffer to collect the items
    // TODO: probably need a more memory efficient structure
    const buffer = [];
    let drainingBuffer = false;

    return function next(abort, callback) {
      if (abort) {
        return callback(end);
      }

      if (buffer.length >= count) {
        debug(`collected ${count} items, sending data`);
        return callback(false, buffer.splice(0));
      }

      read(abort, function(end, data) {
        if (end) {
          if (drainingBuffer) {
            return;
          }

          debug(`upstream end, ending and sending ${buffer.length} items`);
          if (buffer.length > 0) {
            drainingBuffer = true;
            callback(false, buffer.splice(0));
          }

          return callback(true);
        }

        buffer.push(data);
        setImmediate(() => next(end, callback));
      });
    };
  };
};

function separate() {
  const debug = createDebugger('pull-stream:separate');
  
  return function(read) {
    let performingSeparation = false;

    return function next(abort, callback) {
      if (abort) {
        return callback(abort);
      }

      // if we are performing a separation operation abort
      if (performingSeparation) {
        return;
      }

      read(abort, function(end, data) {
        if (end) {
          return callback(end);
        }

        if (!Array.isArray(data)) {
          throw new Error('upstream data is not an array, cannot separate');
        }

        if (data.length === 0) {
          debug('no more results from upstream, ending the stream');
          return callback(true);
        }

        // extract the first 0..n-1 items to send through such that we won't ask the upstream
        // sources for more data
        const head = data.slice(0, -1);
        const tailItem = data.slice(-1)[0];

        debug(`separating a collection of ${data.length} items`);
        performingSeparation = true;
        try {
          head.forEach(data => callback(false, data))
        } finally {
          performingSeparation = false;
        }

        callback(false, tailItem);
      });
    }
  }
}

module.exports = {
  batch,
  separate
};
