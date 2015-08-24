(function(d3, fc, sc) {
    'use strict';

    // Set SVGs & column padding
    var container = d3.select('#app-container');

    var svgPrimary = container.select('svg.primary');
    var svgSecondary = container.select('svg.secondary');
    var svgNav = container.select('svg.nav');

    var dataModel = {
        data: fc.data.random.financial()(250),
        viewDomain: []
    };

    sc.util.calculateDimensions(container);

    var primaryChart = sc.chart.primaryChart();
    var secondaryChart = null;
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
    navChart.on('viewChange', onViewChanged);

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

    var secondaryChartOptions = sc.menu.optionGenerator()
        .on('optionChange', function(secondaryChartType) {
            secondaryChart = secondaryChartType.chart;
            if (secondaryChart) {
                secondaryChart.on('viewChange', onViewChanged);
            }
            resize();
        });

    var SecondaryChartType = function(displayString, valueString, chart) {
        this.displayString = displayString;
        this.valueString = valueString;
        this.chart = chart;
    };

    var noChart = new SecondaryChartType('None', 'no-chart', null);
    var rsiChart = new SecondaryChartType('RSI', 'rsi', sc.chart.rsiChart());

    container.select('#secondary-chart-buttons')
        .datum([noChart, rsiChart])
        .call(secondaryChartOptions);

    // Set Reset button event
    function resetToLive() {
        // Using golden ratio to make initial display area rectangle into the golden rectangle
        var goldenRatio = 1.618;
        var navAspect = parseInt(svgNav.style('height'), 10) / svgNav.attr('width');
        var data = dataModel.data;
        var standardDateDisplay = [data[Math.floor((1 - navAspect * goldenRatio) * data.length)].date,
            data[data.length - 1].date];
        onViewChanged(standardDateDisplay);
    }

    var currDate = new Date();
    var startDate = d3.time.minute.offset(currDate, -200);

    var historicFeed = fc.data.feed.coinbase()
        .granularity(60)
        .start(startDate)
        .end(currDate);

    var callbackGenerator = sc.util.callbackInvalidator();

    var ohlcConverter = sc.data.feed.coinbase.ohlcWebSocketAdaptor()
        .period(60);

    function newBasketReceived(basket) {
        var data = dataModel.data;
        if (data[data.length - 1].date.getTime() !== basket.date.getTime()) {
            data.push(basket);
        } else {
            data[data.length - 1] = basket;
        }
        render();
    }

    function liveCallback(socketEvent, latestBasket) {
        if (socketEvent.type === 'message' && latestBasket) {
            newBasketReceived(latestBasket);
        } else if (socketEvent.type === 'error' ||
            (socketEvent.type === 'close' && socketEvent.code !== 1000)) {
            console.log('Error loading data from coinbase websocket: ' +
                socketEvent.type + ' ' + socketEvent.code);
        }
    }

    function updateDataAndResetChart(newData) {
        dataModel.data = newData;
        resetToLive();
        render();
    }

    function onHistoricDataLoaded(err, newData) {
        if (!err) {
            updateDataAndResetChart(newData.reverse());
            ohlcConverter(liveCallback, newData[newData.length - 1]);
        } else { console.log('Error getting historic data: ' + err); }
    }

    function historicCallback() {
        return callbackGenerator(onHistoricDataLoaded);
    }

    d3.select('#type-selection')
        .on('change', function() {
            var type = d3.select(this).property('value');
            if (type === 'bitcoin') {
                historicFeed(historicCallback());
            } else if (type === 'generated') {
                callbackGenerator.invalidateCallback();
                ohlcConverter.close();
                var newData = fc.data.random.financial()(250);
                updateDataAndResetChart(newData);
            }
        });

    container.select('#reset-button').on('click', resetToLive);

    function render() {
        svgPrimary.datum(dataModel)
            .call(primaryChart);

        if (secondaryChart) {
            svgSecondary.datum(dataModel)
                .call(secondaryChart);
        } else {
            svgSecondary.selectAll('*').remove();
        }

        svgNav.datum(dataModel)
            .call(navChart);
    }

    function resize() {
        sc.util.calculateDimensions(container, secondaryChart);
        render();
    }

    d3.select(window).on('resize', resize);

    resetToLive();
    resize();
})(d3, fc, sc);
