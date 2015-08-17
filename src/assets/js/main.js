(function(d3, fc, sc) {
    'use strict';

    // Set SVGs & column padding
    var container = d3.select('#app-container');

    var svgMain = container.select('svg.primary');
    var svgRSI = container.select('svg.rsi');
    var svgNav = container.select('svg.nav');

    var dataModel = {
        data: fc.data.random.financial()(250),
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

    var ohlcConverter = sc.data.feed.coinbase.ohlcWebSocketAdaptor()
        .period(60);

    var currDate = new Date();
    var startDate = d3.time.minute.offset(currDate, -200);

    var historicFeed = sc.data.feed.coinbase.historicFeed()
        .granularity(60)
        .start(startDate)
        .end(currDate);

    function newBasketReceived(basket) {
        if (data[data.length - 1].date.getTime() !== basket.date.getTime()) {
            data.push(basket);
        } else {
            data[data.length - 1] = basket;
        }
        render();
    }

    function liveCallback(event, latestBasket) {
        if (!event && latestBasket) {
            newBasketReceived(latestBasket);
        } else if (event.type === 'open') {
            // On successful open
        } else if (event.type === 'close' && event.code === 1000) {
            // On successful close
        } else {
            console.log('Error loading data from coinbase websocket: ' +
                event.type + ' ' + event.code);
        }
    }

    function historicCallback(err, newData) {
        if (!err) {
            data = newData;
            resetToLive();
            ohlcConverter(liveCallback);
            render();
        } else { console.log('Error getting historic data: ' + err); }
    }

    d3.select('#type-selection')
        .on('change', function() {
            var type = d3.select(this).property('value');
            if (type === 'live') {
                historicFeed(historicCallback);
                render();
            } else if (type === 'fake') {
                ohlcConverter.close();
                historicFeed.invalidateCallback();
                data = fc.data.random.financial()(250);
                resetToLive();
                render();
            }
        });

    container.select('#reset-button').on('click', resetToLive);

    // Create main chart and set how much data is initially viewed
    var timeSeries = fc.chart.linearTimeSeries()
        .xTicks(6);

    var gridlines = fc.annotation.gridline()
        .yTicks(5)
        .xTicks(0);

    function calculateCloseAxisTagPath(width, height) {
        var h2 = height / 2;
        return [
            [0, 0],
            [h2, -h2],
            [width, -h2],
            [width, h2],
            [h2, h2],
            [0, 0]
        ];
    }

    function positionCloseAxis(sel) {
        sel.enter()
            .select('.right-handle')
            .insert('path', ':first-child')
            .attr('transform', 'translate(' + -40 + ', 0)')
            .attr('d', d3.svg.area()(calculateCloseAxisTagPath(40, 14)));

        sel.select('text')
            .attr('transform', 'translate(' + (-2) + ', ' + 2 + ')')
            .attr('x', 0)
            .attr('y', 0);
    }

    var priceFormat = d3.format('.2f');

    var closeAxisAnnotation = fc.annotation.line()
        .orient('horizontal')
        .value(function(d) { return d.close; })
        .label(function(d) { return priceFormat(d.close); })
        .decorate(function(sel) {
            positionCloseAxis(sel);
            sel.enter().classed('close', true);
        });

    // Create and apply the Moving Average
    var movingAverage = fc.indicator.algorithm.movingAverage();

    // Create a line that renders the result
    var ma = fc.series.line()
        .decorate(function(selection) {
            selection.enter()
                .classed('ma', true);
        })
        .yValue(function(d) { return d.movingAverage; });

    function render() {
        svgMain.datum(data)
            .call(mainChart);

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
