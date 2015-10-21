(function(d3, fc, sc) {
    'use strict';

    sc.menu.side = function() {

        var dispatch = d3.dispatch(
            sc.event.primaryChartSeriesChange,
            sc.event.primaryChartYValueAccessorChange,
            sc.event.primaryChartIndicatorChange,
            sc.event.secondaryChartChange);

        // TODO: Move up to model.
        var candlestick = sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick());
        var ohlc = sc.menu.option('OHLC', 'ohlc', fc.series.ohlc());
        var line = sc.menu.option('Line', 'line', fc.series.line());
        line.option.isLine = true;
        var point = sc.menu.option('Point', 'point', fc.series.point());
        var area = sc.menu.option('Area', 'area', fc.series.area());


        var primaryChartSeriesOptions = sc.menu.generator.buttonGroup()
            .on('optionChange', function(series) {
                dispatch[sc.event.primaryChartSeriesChange](series);
            });

        // TODO: Move up to model (or remove, see #263)
        var open = sc.menu.option('Open', 'open', function(d) { return d.open; });
        var high = sc.menu.option('High', 'high', function(d) { return d.high; });
        var low = sc.menu.option('Low', 'low', function(d) { return d.low; });
        var close = sc.menu.option('Close', 'close', function(d) { return d.close; });

        var primaryChartYValueAccessorOptions = sc.menu.generator.buttonGroup(3) // TODO: '3' on model property.
            .on('optionChange', function(yValueAccessor) {
                dispatch[sc.event.primaryChartYValueAccessorChange](yValueAccessor);
            });

        // TODO: Move up to model.
        var movingAverage = fc.series.line()
            .decorate(function(select) {
                select.enter()
                    .classed('movingAverage', true);
            })
            .yValue(function(d) { return d.movingAverage; });

        var movingAverageIndicator = sc.menu.option('Moving Average', 'movingAverage', movingAverage);
        var bollingerIndicator = sc.menu.option('Bollinger Bands', 'bollinger', fc.indicator.renderer.bollingerBands());

        var primaryChartIndicatorToggle = sc.menu.generator.toggleGroup()
            .on('optionChange', function(indicator) {
                dispatch[sc.event.primaryChartIndicatorChange](indicator);
            });

        // TODO: Move up to model.
        var rsi = sc.menu.option('RSI', 'secondary-rsi', sc.chart.rsi());
        var macd = sc.menu.option('MACD', 'secondary-macd', sc.chart.macd());
        var volume = sc.menu.option('Volume', 'secondary-volume', sc.chart.volume());

        var secondaryChartToggle = sc.menu.generator.toggleGroup()
            .on('optionChange', function(chart) {
                dispatch[sc.event.secondaryChartChange](chart);
            });

        var side = function(selection) {
            // TODO: var model = selection.datum();
            selection.each(function() { // TODO: Do we really need to support multiple selection here ?
                var selection = d3.select(this);

                selection.select('#series-buttons')
                    // TODO: Rename optionList to options.
                    .datum({optionList: [candlestick, ohlc, line, point, area]})
                    .call(primaryChartSeriesOptions);

                selection.select('#y-value-accessor-buttons')
                    .datum({optionList: [open, high, low, close]})
                    .call(primaryChartYValueAccessorOptions);

                selection.select('#indicator-buttons')
                    .datum({optionList: [movingAverageIndicator, bollingerIndicator]})
                    .call(primaryChartIndicatorToggle);

                selection.select('#secondary-chart-buttons')
                    .datum({optionList: [rsi, macd, volume]})
                    .call(secondaryChartToggle);
            });
        };

        return d3.rebind(side, dispatch, 'on');
    };
})(d3, fc, sc);
