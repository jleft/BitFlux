(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.seriesOptions = function() {

        var candlestick = sc.series.candlestick();
        candlestick.id = sc.util.uid();
        var candlestickOption = sc.model.menu.option('Candlestick', 'candlestick', candlestick);
        candlestickOption.isSelected = true;

        var ohlc = fc.series.ohlc();
        ohlc.id = sc.util.uid();

        var line = fc.series.line();
        line.id = sc.util.uid();

        var point = fc.series.point();
        point.id = sc.util.uid();

        var area = fc.series.area();
        area.id = sc.util.uid();

        return [
            candlestickOption,
            sc.model.menu.option('OHLC', 'ohlc', ohlc),
            sc.model.menu.option('Line', 'line', line),
            sc.model.menu.option('Point', 'point', point),
            sc.model.menu.option('Area', 'area', area)
        ];
    };

})(d3, fc, sc);
