(function(d3, fc, sc) {
    'use strict';

    // Set SVGs & column padding
    var container = d3.select('#chart-example');

    var svgMain = container.select('svg.primary');
    var svgRSI = container.select('svg.rsi');
    var svgNav = container.select('svg.nav');

    var candlestick = fc.series.candlestick();
    var ohlc = fc.series.ohlc();
    var point = fc.series.point();
    var line = fc.series.line();
    line.isLine = true;
    var area = fc.series.area();
    var currentIndicator;
    var currentSeries;

    var dataModel = {
        data: fc.data.random.financial()(250),
        viewDomain: []
    };

    var movingAverage = fc.series.line()
        .decorate(function(select) {
            select.enter().classed('movingAverage', true);
        })
        .yValue(function(d) { return d.movingAverage; });

    var bollinger = fc.indicator.renderer.bollingerBands();

    sc.util.calculateDimensions(container);

    var primaryChart = sc.chart.primaryChart();
    var rsiChart = sc.chart.rsiChart();
    var navChart = sc.chart.navChart();

    function onViewChanged(domain) {
        dataModel.viewDomain = [domain[0], domain[1]];
        render();
    }

    primaryChart.on('viewChange', onViewChanged);
    rsiChart.on('viewChange', onViewChanged);
    navChart.on('viewChange', onViewChanged);

    function changeSeries(seriesTypeString) {
        switch (seriesTypeString) {
            case 'ohlc':
                currentSeries = ohlc;
                break;
            case 'candlestick':
                currentSeries = candlestick;
                break;
            case 'line':
                currentSeries = line;
                break;
            case 'point':
                currentSeries = point;
                break;
            case 'area':
                currentSeries = area;
                break;
            default:
                currentSeries = candlestick;
                break;
        }
        primaryChart.changeSeries(currentSeries, currentIndicator);
    }

    changeSeries('candlestick');

    d3.select('#series-buttons')
        .selectAll('.btn')
        .on('click', function() {
            var seriesTypeString = d3.select(this)
                .select('input')
                .node()
                .value;
            changeSeries(seriesTypeString);
            render();
        });


    function changeIndicator(indicatorType) {
        switch (indicatorType) {
            case 'movingAverage':
                currentIndicator = movingAverage;
                break;
            case 'bollinger':
                currentIndicator = bollinger;
                break;
            case 'no-indicator':
                currentIndicator = null;
                break;
            default:
                currentIndicator = null;
                break;
        }
        primaryChart.changeIndicator(currentIndicator, currentSeries);
    }

    d3.select('#indicator-buttons')
        .selectAll('.btn')
        .on('click', function() {
            var indicatorType = d3.select(this)
                .select('input')
                .node()
                .value;
            changeIndicator(indicatorType);
            render();
        });

    // Set Reset button event
    function resetToLive() {
        // Using golden ratio to make initial display area rectangle into the golden rectangle
        var goldenRatio = 1.618;
        var navAspect = parseInt(svgNav.style('height'), 10) / svgNav.attr('width');
        var data = dataModel.data;
        var standardDateDisplay = [data[Math.floor((1 - navAspect * goldenRatio) * data.length)].date,
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