(function(d3, fc, sc) {
    'use strict';

    sc.model.chart.legend = function(initialProduct, initialPeriod) {
        return {
            data: undefined,
            product: initialProduct,
            period: initialPeriod
        };
    };

})(d3, fc, sc);
