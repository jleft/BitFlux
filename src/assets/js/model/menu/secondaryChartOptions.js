(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.secondaryChartOptions = function() {

        return [
            sc.model.menu.option('RSI', 'secondary-rsi', sc.chart.secondary.rsi()),
            sc.model.menu.option('MACD', 'secondary-macd', sc.chart.secondary.macd()),
            sc.model.menu.option('Volume', 'secondary-volume', sc.chart.secondary.volume())
        ];
    };

})(d3, fc, sc);
