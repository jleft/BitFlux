(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.secondaryChartOptions = function() {
        return [
            sc.model.menu.option(
                'Relative Strength Index',
                'secondary-rsi',
                sc.chart.secondary.rsi(),
                'sc-icon-rsi-indicator'),
            sc.model.menu.option(
                'MACD',
                'secondary-macd',
                sc.chart.secondary.macd(),
                'sc-icon-macd-indicator'),
            sc.model.menu.option(
                'Volume',
                'secondary-volume',
                sc.chart.secondary.volume(),
                'sc-icon-bar-series')
        ];
    };

})(d3, fc, sc);
