(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.seriesOptions = function() {

        // TODO: Could 'isLine' go on primary chart series model instead?
        var line = fc.series.line();
        line.isLine = true;

        var candlestickOption = sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick());
        candlestickOption.isSelected = true;

        return [
            candlestickOption,
            sc.menu.option('OHLC', 'ohlc', fc.series.ohlc()),
            sc.menu.option('Line', 'line', line),
            sc.menu.option('Point', 'point', fc.series.point()),
            sc.menu.option('Area', 'area', fc.series.area())
        ];
    };

})(d3, fc, sc);
