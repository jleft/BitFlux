(function(d3, fc, sc) {
    'use strict';
    // Define primary series types
    var SeriesType = function(displayString, valueString, series) {
        this.displayString = displayString;
        this.valueString = valueString;
        this.series = series;
    };

    var candlestick = new SeriesType('Candlestick', 'candlestick', fc.series.candlestick());
    var ohlc = new SeriesType('OHLC', 'ohlc', fc.series.ohlc());
    var line = new SeriesType('Line', 'line', fc.series.line());
    line.series.isLine = true;
    var point = new SeriesType('Point', 'point', fc.series.point());
    var area = new SeriesType('Area', 'area', fc.series.area());

    sc.menu.returnPrimarySeries = function() {
        return [candlestick, ohlc, line, point, area];
    };
})(d3, fc, sc);