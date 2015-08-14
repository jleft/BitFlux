(function(d3, fc) {
    'use strict';

    var SeriesType = function(displayString, valueString, series) {
        this.displayString = displayString;
        this.valueString = valueString;
        this.series = series;
    };

    var candlestick = new SeriesType('Candlestick', 'candlestick', fc.series.candlestick());
    var ohlc = new SeriesType('OHLC', 'ohlc', fc.series.ohlc());
    var line = new SeriesType('Line', 'line', fc.series.line());
    var point = new SeriesType('Point', 'point', fc.series.point());
    var area = new SeriesType('Area', 'area', fc.series.area());

    var seriesTypeArray = [candlestick, ohlc, line, point, area];

    d3.select('#series-buttons')
        .selectAll('label')
        .data(seriesTypeArray)
        .enter()
        .append('label')
        .classed('btn btn-default', true)
        .classed('active', function(d, i) { return (i === 0); })
        .text(function(d, i) { return d.displayString; })
        .insert('input')
        .attr({
            type: 'radio',
            name: 'options',
            value: function(d, i) { return d.valueString; }
        })
        .property('checked', function(d, i) { return (i === 0); });

    sc.menu.selectSeries = function(seriesTypeString) {
        for (var i = 0; i < seriesTypeArray.length; i++) {
            if (seriesTypeString === seriesTypeArray[i].valueString) {
                return seriesTypeArray[i].series;
            }
        }
        return candlestick.series;
    };

})(d3, fc);