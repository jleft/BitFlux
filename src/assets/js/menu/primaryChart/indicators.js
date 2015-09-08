(function(d3, fc, sc) {
    'use strict';

    sc.menu.primaryChart.indicators = function() {

        var dispatch = d3.dispatch('primaryChartIndicatorChange');

        var movingAverage = fc.series.line()
            .decorate(function(select) {
                select.enter()
                    .classed('movingAverage', true);
            })
            .yValue(function(d) { return d.movingAverage; });

        var noIndicator = sc.menu.option('None', 'no-indicator', null);
        var movingAverageIndicator = sc.menu.option('Moving Average', 'movingAverage', movingAverage);
        var bollingerIndicator = sc.menu.option('Bollinger Bands', 'bollinger', fc.indicator.renderer.bollingerBands());

        var options = sc.menu.generator.buttonGroup()
            .on('optionChange', function(indicator) {
                dispatch.primaryChartIndicatorChange(indicator);
            });

        var primaryChartSeriesMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([noIndicator, movingAverageIndicator, bollingerIndicator]);
                selection.call(options);
            });
        };

        return d3.rebind(primaryChartSeriesMenu, dispatch, 'on');
    };
})(d3, fc, sc);