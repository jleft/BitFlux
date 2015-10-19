(function(d3, fc, sc) {
    'use strict';

    sc.model.primaryChart = function() {
        return {
            data: [],
            trackingLatest: true,
            viewDomain: [],
            series: sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick()),
            yValueAccessor: {option: function(d) { return d.close; }},
            toggledIndicator: undefined
        };
    };

})(d3, fc, sc);
