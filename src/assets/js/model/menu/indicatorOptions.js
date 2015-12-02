(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.indicatorOptions = function() {

        var movingAverage = fc.series.line()
            .decorate(function(select) {
                select.enter()
                    .classed('movingAverage', true);
            })
            .yValue(function(d) { return d.movingAverage; });

        return [
            sc.menu.option('Moving Average', 'movingAverage',
                movingAverage, 'sc-icon-moving-average-indicator'),
            sc.menu.option('Bollinger Bands', 'bollinger',
                fc.indicator.renderer.bollingerBands(), 'sc-icon-bollinger-bands-indicator')
        ];
    };

})(d3, fc, sc);
