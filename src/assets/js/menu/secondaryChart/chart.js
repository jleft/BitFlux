(function(d3, fc, sc) {
    'use strict';

    sc.menu.secondaryChart.chart = function() {

        var dispatch = d3.dispatch('secondaryChartChange');

        var rsiChart = sc.menu.option('RSI', 'rsi', sc.chart.rsiChart());
        var macdChart = sc.menu.option('MACD', 'macd', sc.chart.macdChart());

        var toggle = sc.menu.generator.toggleGroup()
            .on('toggleChange', function(chart) {
                dispatch.secondaryChartChange(chart);
            });

        var secondaryChartMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([rsiChart, macdChart]);
                selection.call(toggle);
            });
        };

        return d3.rebind(secondaryChartMenu, dispatch, 'on');
    };
})(d3, fc, sc);