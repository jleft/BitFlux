(function(d3, fc, sc) {
    'use strict';

    sc.menu.secondary.chart = function() {

        var dispatch = d3.dispatch('secondaryChartChange');

        var rsi = sc.menu.option('RSI', 'rsi', sc.chart.rsi());
        var macd = sc.menu.option('MACD', 'macd', sc.chart.macd());

        var toggle = sc.menu.generator.toggleGroup()
            .on('toggleChange', function(chart) {
                dispatch.secondaryChartChange(chart);
            });

        var secondaryChartMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([rsi, macd]);
                selection.call(toggle);
            });
        };

        return d3.rebind(secondaryChartMenu, dispatch, 'on');
    };
})(d3, fc, sc);