(function(d3, fc, sc) {
    'use strict';

    sc.menu.secondaryChart.chart = function() {

        var dispatch = d3.dispatch('secondaryChartChange');

        var noChart = sc.menu.option('None', 'no-chart', null);
        var rsiChart = sc.menu.option('RSI', 'rsi', sc.chart.rsiChart());

        var options = sc.menu.generator.buttonGroup()
            .on('optionChange', function(chart) {
                dispatch.secondaryChartChange(chart);
            });

        var secondaryChartMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([noChart, rsiChart]);
                selection.call(options);
            });
        };

        return d3.rebind(secondaryChartMenu, dispatch, 'on');
    };
})(d3, fc, sc);