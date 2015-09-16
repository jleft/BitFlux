(function(d3, fc, sc) {
    'use strict';

    sc.menu.side = function() {

        var dispatch = d3.dispatch('primaryChartSeriesChange',
            'primaryChartPriceChange',
            'primaryChartIndicatorChange',
            'secondaryChartChange');

        var primaryChartSeriesOptions = sc.menu.primary.series()
            .on('primaryChartSeriesChange', function(series) {
                dispatch.primaryChartSeriesChange(series);
            });

        var primaryChartPriceOptions = sc.menu.primary.price()
            .on('primaryChartPriceChange', function(price) {
                dispatch.primaryChartPriceChange(price);
            });

        var primaryChartIndicatorOptions = sc.menu.primary.indicators()
            .on('primaryChartIndicatorChange', function(toggledIndicator) {
                dispatch.primaryChartIndicatorChange(toggledIndicator);
            });

        var secondaryChartOptions = sc.menu.secondary.chart()
            .on('secondaryChartChange', function(toggledChart) {
                dispatch.secondaryChartChange(toggledChart);
            });

        var side = function(selection) {
            selection.each(function() {
                var selection = d3.select(this);
                selection.select('#series-buttons')
                    .call(primaryChartSeriesOptions);
                selection.select('#price-buttons')
                    .call(primaryChartPriceOptions);
                selection.select('#indicator-buttons')
                    .call(primaryChartIndicatorOptions);
                selection.select('#secondary-chart-buttons')
                    .call(secondaryChartOptions);
            });
        };

        return d3.rebind(side, dispatch, 'on');
    };
})(d3, fc, sc);