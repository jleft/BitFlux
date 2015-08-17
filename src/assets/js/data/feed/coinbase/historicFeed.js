(function(sc) {
    'use strict';

    sc.data.feed.coinbase.historicFeed = function() {
        var feed = fc.data.feed.coinbase();
        var n = 0;

        function historicFeed(callback) {
            var id = ++n;
            feed(function(err, newData) {
                if (id < n) { return; }
                if (!err) {
                    newData = newData.reverse();
                    callback(null, newData);
                } else { callback(err, null); }
            });
        }

        d3.rebind(historicFeed, feed, 'granularity', 'start', 'end');

        historicFeed.invalidateCallback = function() {
            n++;
            return historicFeed;
        };

        return historicFeed;
    };

})(sc);