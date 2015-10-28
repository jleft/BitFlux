(function(d3, fc, sc) {
    'use strict';

    sc.model.secondaryChart = function(initialProduct) {
        return {
            data: [],
            viewDomain: [],
            trackingLatest: true,
            product: initialProduct
        };
    };

})(d3, fc, sc);
