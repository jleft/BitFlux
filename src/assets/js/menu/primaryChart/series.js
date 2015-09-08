(function(d3, fc, sc) {
    'use strict';

    sc.menu.primaryChart.series = function() {

        var dispatch = d3.dispatch('primaryChartSeriesChange');

        var candlestick = sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick());
        var ohlc = sc.menu.option('OHLC', 'ohlc', fc.series.ohlc());
        var line = sc.menu.option('Line', 'line', fc.series.line());
        line.option.isLine = true;
        var point = sc.menu.option('Point', 'point', fc.series.point());
        var area = sc.menu.option('Area', 'area', fc.series.area());

        var options = sc.menu.generator.buttonGroup()
            .on('optionChange', function(series) {
                dispatch.primaryChartSeriesChange(series);
            });

        var primaryChartSeriesMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([candlestick, ohlc, line, point, area]);
                selection.call(options);
            });
        };

        return d3.rebind(primaryChartSeriesMenu, dispatch, 'on');
    };

})(d3, fc, sc);