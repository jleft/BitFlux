(function(d3, fc, sc) {
    'use strict';

    sc.menu.primary.indicators = function() {

        var dispatch = d3.dispatch('primaryChartIndicatorChange');

        var movingAverage = fc.series.line()
            .decorate(function(select) {
                select.enter()
                    .classed('movingAverage', true);
            })
            .yValue(function(d) { return d.movingAverage; });

        var movingAverageIndicator = sc.menu.option('Moving Average', 'movingAverage', movingAverage);
        var bollingerIndicator = sc.menu.option('Bollinger Bands', 'bollinger', fc.indicator.renderer.bollingerBands());

        var toggle = sc.menu.generator.toggleGroup()
            .on('toggleChange', function(indicator) {
                dispatch.primaryChartIndicatorChange(indicator);
            });

        var primaryChartIndicatorMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([movingAverageIndicator, bollingerIndicator]);
                selection.call(toggle);
            });
        };

        return d3.rebind(primaryChartIndicatorMenu, dispatch, 'on');
    };
})(d3, fc, sc);