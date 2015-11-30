(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.secondaryChartOptions = function() {
        return [
            sc.menu.option(
                'Relative Strength Index',
                'secondary-rsi',
                sc.chart.secondary.rsi(),
                'sc-icon-rsi-indicator'),
            sc.menu.option(
                'MACD',
                'secondary-macd',
                sc.chart.secondary.macd(),
                'sc-icon-macd-indicator')
        ];
    };

})(d3, fc, sc);
