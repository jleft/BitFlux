(function(sc) {
    'use strict';

    sc.data.feed.coinbase.invalidator = function() {
        var n = 0;

        function invalidator(callback) {
            var id = ++n;
            return function(err, data) {
                if (id < n) { return; }
                callback(err, data);
            };
        }

        invalidator.invalidateCallback = function() {
            n++;
            return invalidator;
        };

        return invalidator;
    };

})(sc);