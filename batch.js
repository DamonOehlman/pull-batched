const debug = require('debug')('pull-stream:batch');

module.exports = function(count) {
  if (typeof count != 'number') {
    throw new Error('a numeric count must be specified for batching');
  }

  return function(read) {
    // initialise the buffer to collect the items
    // TODO: probably need a more memory efficient structure
    const buffer = [];

    return function next(abort, callback) {
      if (abort) {
        return callback(abort);
      }

      read(abort, function(end, data) {
        if (end) {
          debug(`upstream end, ending and sending ${buffer.length} items`);
          if (buffer.length > 0) {
            callback(false, buffer.splice(0));
          }

          return callback(true);
        }

        buffer.push(data);
        if (buffer.length >= count) {
          const items = buffer.splice(0);
          debug(`collected ${count} items, sending data`);
          return callback(false, items);
        }

        next(false, callback);
      });
    };
  };
};
