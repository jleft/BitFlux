(function(d3, fc, sc) {
    'use strict';

    sc.menu.side = function() {

        var dispatch = d3.dispatch('primaryChartSeriesChange',
            'primaryChartIndicatorChange',
            'secondaryChartChange');

        var primaryChartSeriesOptions = sc.menu.primaryChart.series()
            .on('primaryChartSeriesChange', function(series) {
                dispatch.primaryChartSeriesChange(series);
            });

        var primaryChartIndicatorOptions = sc.menu.primaryChart.indicators()
            .on('primaryChartIndicatorChange', function(toggledIndicator) {
                dispatch.primaryChartIndicatorChange(toggledIndicator);
            });

        var secondaryChartOptions = sc.menu.secondaryChart.chart()
            .on('secondaryChartChange', function(toggledChart) {
                dispatch.secondaryChartChange(toggledChart);
            });

        var side = function(selection) {
            selection.each(function() {
                var selection = d3.select(this);
                selection.select('#series-buttons')
                    .call(primaryChartSeriesOptions);
                selection.select('#indicator-buttons')
                    .call(primaryChartIndicatorOptions);
                selection.select('#secondary-chart-buttons')
                    .call(secondaryChartOptions);
            });
        };

        return d3.rebind(side, dispatch, 'on');
    };
})(d3, fc, sc);