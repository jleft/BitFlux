(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.indicatorOptions = function() {

        var movingAverage = fc.series.line()
            .decorate(function(select) {
                select.enter()
                    .classed('movingAverage', true);
            })
            .yValue(function(d) { return d.movingAverage; });
        movingAverage.id = sc.util.uid();

        var bollingerBands = fc.indicator.renderer.bollingerBands();
        bollingerBands.id = sc.util.uid();

        return [
            sc.model.menu.option('Moving Average', 'movingAverage',
                movingAverage, 'sc-icon-moving-average-indicator'),
            sc.model.menu.option('Bollinger Bands', 'bollinger',
                bollingerBands, 'sc-icon-bollinger-bands-indicator')
        ];
    };

}(d3, fc, sc));
