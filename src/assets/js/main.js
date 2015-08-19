(function(d3, fc, sc) {
    'use strict';

    // Set SVGs & column padding
    var container = d3.select('#app-container');

    var svgMain = container.select('svg.primary');
    var svgRSI = container.select('svg.rsi');
    var svgNav = container.select('svg.nav');

    var dataModel = {
        data: fc.data.random.financial()(40),
        viewDomain: []
    };

    sc.util.calculateDimensions(container);

    var primaryChart = sc.chart.primaryChart();
    var rsiChart = sc.chart.rsiChart();
    var navChart = sc.chart.navChart();

    var seriesOptions = sc.menu.optionGenerator()
        .on('optionChange', function(seriesType) {
            primaryChart.changeSeries(seriesType.series);
            render();
        });

    var indicatorOptions = sc.menu.optionGenerator()
        .on('optionChange', function(indicatorType) {
            primaryChart.changeIndicator(indicatorType.indicator);
            render();
        });


    function onViewChanged(domain) {
        dataModel.viewDomain = [domain[0], domain[1]];
        render();
    }

    primaryChart.on('viewChange', onViewChanged);
    rsiChart.on('viewChange', onViewChanged);
    navChart.on('viewChange', onViewChanged);

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

    container.select('#series-buttons')
        .datum([candlestick, ohlc, line, point, area])
        .call(seriesOptions);

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

    container.select('#indicator-buttons')
        .datum([noIndicator, movingAverageIndicator, bollingerIndicator])
        .call(indicatorOptions);

    // Set Reset button event
    function resetToLive() {
        var data = dataModel.data;

        var pointsDisplayed = data.length < 50 ? data.length : 50;
        var standardDateDisplay = [data[data.length - pointsDisplayed].date,
            data[data.length - 1].date];
        onViewChanged(standardDateDisplay);
        render();
    }

    container.select('#reset-button').on('click', resetToLive);

    function render() {
        svgMain.datum(dataModel)
            .call(primaryChart);

        svgRSI.datum(dataModel)
            .call(rsiChart);

        svgNav.datum(dataModel)
            .call(navChart);
    }

    function resize() {
        sc.util.calculateDimensions(container);
        render();
    }

    d3.select(window).on('resize', resize);

    resetToLive();
    resize();

})(d3, fc, sc);
