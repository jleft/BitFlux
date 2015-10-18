(function(d3, fc, sc) {
    'use strict';

    sc.menu.side = function() {

        var dispatch = d3.dispatch(
            sc.event.primaryChartSeriesChange,
            sc.event.primaryChartYValueAccessorChange,
            sc.event.primaryChartIndicatorChange,
            sc.event.secondaryChartChange);

        var candlestick = sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick());
        var ohlc = sc.menu.option('OHLC', 'ohlc', fc.series.ohlc());
        var line = sc.menu.option('Line', 'line', fc.series.line());
        line.option.isLine = true;
        var point = sc.menu.option('Point', 'point', fc.series.point());
        var area = sc.menu.option('Area', 'area', fc.series.area());

        var primaryChartSeriesOptions = sc.menu.group()
            .formOptionListFromCollection([candlestick, ohlc, line, point, area], fc.util.fn.identity)
            .generator(sc.menu.generator.buttonGroup())
            .on('optionChange', function(series) {
                dispatch[sc.event.primaryChartSeriesChange](series);
            });

        var open = sc.menu.option('Open', 'open', function(d) { return d.open; });
        var high = sc.menu.option('High', 'high', function(d) { return d.high; });
        var low = sc.menu.option('Low', 'low', function(d) { return d.low; });
        var close = sc.menu.option('Close', 'close', function(d) { return d.close; });

        var primaryChartYValueAccessorOptions = sc.menu.group()
            .formOptionListFromCollection([open, high, low, close], fc.util.fn.identity)
            .generator(sc.menu.generator.buttonGroup(3))
            .on('optionChange', function(yValueAccessor) {
                dispatch[sc.event.primaryChartYValueAccessorChange](yValueAccessor);
            });

        var movingAverage = fc.series.line()
            .decorate(function(select) {
                select.enter()
                    .classed('movingAverage', true);
            })
            .yValue(function(d) { return d.movingAverage; });

        var movingAverageIndicator = sc.menu.option('Moving Average', 'movingAverage', movingAverage);
        var bollingerIndicator = sc.menu.option('Bollinger Bands', 'bollinger', fc.indicator.renderer.bollingerBands());

        var primaryChartIndicatorToggle = sc.menu.group()
            .formOptionListFromCollection([movingAverageIndicator, bollingerIndicator], fc.util.fn.identity)
            .generator(sc.menu.generator.toggleGroup())
            .on('optionChange', function(indicator) {
                dispatch[sc.event.primaryChartIndicatorChange](indicator);
            });

        var rsi = sc.menu.option('RSI', 'secondary-rsi', sc.chart.rsi());
        var macd = sc.menu.option('MACD', 'secondary-macd', sc.chart.macd());
        var volume = sc.menu.option('Volume', 'secondary-volume', sc.chart.volume());

        var secondaryChartToggle = sc.menu.group()
            .formOptionListFromCollection([rsi, macd, volume], fc.util.fn.identity)
            .generator(sc.menu.generator.toggleGroup())
            .on('optionChange', function(chart) {
                dispatch[sc.event.secondaryChartChange](chart);
            });

        var side = function(selection) {
            selection.each(function() {
                var selection = d3.select(this);
                selection.select('#series-buttons')
                    .call(primaryChartSeriesOptions);
                selection.select('#y-value-accessor-buttons')
                    .call(primaryChartYValueAccessorOptions);
                selection.select('#indicator-buttons')
                    .call(primaryChartIndicatorToggle);
                selection.select('#secondary-chart-buttons')
                    .call(secondaryChartToggle);
            });
        };

        return d3.rebind(side, dispatch, 'on');
    };
})(d3, fc, sc);
