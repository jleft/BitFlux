(function(d3, fc, sc) {
    'use strict';

    sc.model.primaryChart = function(initialProduct) {
        return {
            data: [],
            trackingLatest: true,
            viewDomain: [],
            series: sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick()),
            yValueAccessor: {option: function(d) { return d.close; }},
            indicators: [],
            product: initialProduct,
            width: undefined
        };
    };

})(d3, fc, sc);
