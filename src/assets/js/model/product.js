(function(d3, fc, sc) {
    'use strict';

    sc.model.product = function(config) {
        return {
            display: config.display || 'Unspecified Product',
            priceFormat: d3.format(config.priceFormat || '.2f'),
            volumeFormat: d3.format(config.volumeFormat || 's'),
            periods: config.periods || []
        };
    };

})(d3, fc, sc);
