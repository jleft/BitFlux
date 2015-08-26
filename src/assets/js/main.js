(function(d3, fc, sc) {
    'use strict';

    // Set SVGs & column padding
    var container = d3.select('#app-container');

    var svgPrimary = container.select('svg.primary');
    var svgSecondary = container.select('svg.secondary');
    var svgXAxis = container.select('svg.x-axis');
    var svgNav = container.select('svg.nav');

    var dataModel = {
        data: fc.data.random.financial()(250),
        viewDomain: []
    };

    var primaryChart = sc.chart.primaryChart();
    var secondaryChart = null;
    var xAxis = sc.chart.xAxis();
    var navChart = sc.chart.navChart();

    function onViewChanged(domain) {
        dataModel.viewDomain = [domain[0], domain[1]];
        render();
    }

    primaryChart.on('viewChange', onViewChanged);
    xAxis.on('viewChange', onViewChanged);
    navChart.on('viewChange', onViewChanged);

    var mainMenu = sc.menu.main()
        .on('primaryChartSeriesChange', function(series) {
            primaryChart.changeSeries(series.option);
            /* Elements are drawn in the order they appear in the HTML - at this minute,
            D3FC doesn't maintain the ordering of elements, so it's easiest to just
            remove them and re-write them to the DOM in the correct order. */
            svgPrimary.selectAll('.multi')
                .remove();
            render();
        })
        .on('primaryChartIndicatorChange', function(indicator) {
            primaryChart.changeIndicator(indicator.option);
            svgPrimary.selectAll('.multi')
                .remove();
            render();
        })
        .on('secondaryChartChange', function(chart) {
            secondaryChart = chart.option;
            svgSecondary.selectAll('*')
                .remove();
            if (secondaryChart) {
                secondaryChart.on('viewChange', onViewChanged);
            }
            resize();
        });

    container.select('.menu')
        .call(mainMenu);

    // Set Reset button event
    function resetToLive() {
        var data = dataModel.data;

        var pointsDisplayed = data.length < 50 ? data.length : 50;
        var standardDateDisplay = [data[data.length - pointsDisplayed].date,
            data[data.length - 1].date];
        onViewChanged(standardDateDisplay);
    }

    function changePeriod(period) {
        historicFeed.granularity(period);
        ohlcConverter.period(period);
    }

    var historicFeed = fc.data.feed.coinbase();
    var callbackGenerator = sc.util.callbackInvalidator();
    var ohlcConverter = sc.data.feed.coinbase.ohlcWebSocketAdaptor();

    changePeriod(60 * 60 * 12);

    function setPeriodChangeVisibility(visible) {
        var visibility = visible ? 'visible' : 'hidden';
        d3.select('#period-selection')
        .style('visibility', visibility);
    }

    setPeriodChangeVisibility(false);

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

    function updateHistoricFeedDateRangeToPresent() {
        var currDate = new Date();
        var startDate = d3.time.minute.offset(currDate, -200);
        historicFeed.start(startDate)
            .end(currDate);
    }

    d3.select('#type-selection')
        .on('change', function() {
            var type = d3.select(this).property('value');
            if (type === 'bitcoin') {
                updateHistoricFeedDateRangeToPresent();
                historicFeed(historicCallback());
                setPeriodChangeVisibility(true);
            } else if (type === 'generated') {
                callbackGenerator.invalidateCallback();
                ohlcConverter.close();
                var newData = fc.data.random.financial()(250);
                updateDataAndResetChart(newData);
                setPeriodChangeVisibility(false);
            }
        });

    // hide/show on type change
    d3.select('#period-selection')
        .on('change', function() {
            var period = d3.select(this).property('value');
            changePeriod(period);
            callbackGenerator.invalidateCallback();
            ohlcConverter.close();
            historicFeed(historicCallback());
        });

    container.select('#reset-button').on('click', resetToLive);

    function render() {
        svgPrimary.datum(dataModel)
            .call(primaryChart);

        if (secondaryChart) {
            svgSecondary.datum(dataModel)
                .call(secondaryChart);
        }

        svgXAxis.datum(dataModel)
            .call(xAxis);

        svgNav.datum(dataModel)
            .call(navChart);
    }

    function resize() {
        sc.util.calculateDimensions(container, secondaryChart);
        render();
    }

    d3.select(window).on('resize', resize);

    sc.util.calculateDimensions(container, secondaryChart);
    resetToLive();
})(d3, fc, sc);
