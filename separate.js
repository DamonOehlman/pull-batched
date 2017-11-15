const debug = require('debug')('pull-stream:separate');

module.exports = function() {
  return function(read) {
    let queued = [];

    return function next(abort, callback) {
      if (queued.length > 0 && !abort) {
        return sendNextQueued();
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

        queued = queued.concat(data);
        return sendNextQueued();
      });

      function sendNextQueued() {
        const nextItem = queued[0];
        queued = queued.slice(1);
        return callback(false, nextItem);
      }
    }
  }
};
