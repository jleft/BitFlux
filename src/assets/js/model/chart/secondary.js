(function(d3, fc, sc) {
    'use strict';

    sc.model.chart.secondary = function(initialProduct) {
        return {
            data: [],
            viewDomain: [],
            trackingLatest: true,
            product: initialProduct
        };
    };

}(d3, fc, sc));
