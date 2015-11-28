(function(d3, fc, sc) {
    'use strict';

    sc.model.period = function(config) {
        config = config || {};
        return {
            display: config.display || '1 day',
            seconds: config.seconds || 60 * 60 * 24,
            d3TimeInterval: config.d3TimeInterval || {unit: d3.time.day, value: 1},
            timeFormat: d3.time.format(config.timeFormat || '%b %d')
        };
    };

})(d3, fc, sc);
