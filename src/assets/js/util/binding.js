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

    // Define secondary series types
    var SecondaryChartType = function(displayString, valueString, chart) {
        this.displayString = displayString;
        this.valueString = valueString;
        this.chart = chart;
    };

    var noChart = new SecondaryChartType('None', 'no-chart', null);
    var rsiChart = new SecondaryChartType('RSI', 'rsi', sc.chart.rsiChart());

    // Define indicators
    var IndicatorType = function(displayString, valueString, indicator) {
        this.displayString = displayString;
        this.valueString = valueString;
        this.indicator = indicator;
    };

    var movingAverage = fc.series.line()
        .decorate(function(select) {
            select.enter().classed('movingAverage', true);
        })
        .yValue(function(d) { return d.movingAverage; });

    var noIndicator = new IndicatorType('None', 'no-indicator', null);
    var movingAverageIndicator = new IndicatorType('Moving Average', 'movingAverage', movingAverage);
    var bollingerIndicator = new IndicatorType('Bollinger Bands', 'bollinger', fc.indicator.renderer.bollingerBands());


    sc.util.bindSeriesToContainer = function(selection) {
        selection.datum([candlestick, ohlc, line, point, area]);
    };

    sc.util.bindSecondarySeriesToContainer = function(selection) {
        selection.datum([noChart, rsiChart]);
    };

    sc.util.bindIndicatorsToContainer = function(selection) {
        selection.datum([noIndicator, movingAverageIndicator, bollingerIndicator]);
    };


})(d3, fc, sc);