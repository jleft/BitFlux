(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.secondaryChartOptions = function() {

        return [
            sc.menu.option('RSI', 'secondary-rsi', sc.chart.secondary.rsi()),
            sc.menu.option('MACD', 'secondary-macd', sc.chart.secondary.macd()),
            sc.menu.option('Volume', 'secondary-volume', sc.chart.secondary.volume())
        ];
    };

})(d3, fc, sc);
