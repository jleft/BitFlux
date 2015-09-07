(function(d3, fc, sc) {
    'use strict';

    // Set SVGs & column padding
    var container = d3.select('#app-container');

    var svgPrimary = container.select('svg.primary');
    var svgSecondary = container.select('svg.secondary');
    var svgXAxis = container.select('svg.x-axis');
    var svgNav = container.select('svg.nav');

    var dataModel = {
        data: [],
        period: 60 * 60 * 24,
        viewDomain: []
    };

    var primaryChart = sc.chart.primaryChart();
    var secondaryChart = null;
    var xAxis = sc.chart.xAxis();
    var navChart = sc.chart.navChart();

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

    function trackingLiveData() {
        var latestViewedTime = dataModel.viewDomain[1].getTime();
        var lastDatumTime = dataModel.data[dataModel.data.length - 1].date.getTime();
        return (latestViewedTime === lastDatumTime);
    }

    function onViewChanged(domain) {
        dataModel.viewDomain = [domain[0], domain[1]];
        render();
    }

    function resetToLive() {
        var data = dataModel.data;
        var extent = fc.util.extent(data, 'date');
        var timeExtent = (extent[1].getTime() - extent[0].getTime()) / 1000;
        var navTimeExtent = timeExtent / 5;
        var latest = data[data.length - 1].date;
        var navTimeDomain = [d3.time.second.offset(latest, -navTimeExtent), latest];
        onViewChanged(navTimeDomain);
    }

    primaryChart.on('viewChange', onViewChanged);
    xAxis.on('viewChange', onViewChanged);
    navChart.on('viewChange', onViewChanged);

    var dataInterface = sc.data.dataInterface()
        .on('messageReceived', function(socketEvent, data) {
            if (socketEvent.type === 'error' ||
                (socketEvent.type === 'close' && socketEvent.code !== 1000)) {
                console.log('Error loading data from coinbase websocket: ' +
                socketEvent.type + ' ' + socketEvent.code);
            } else if (socketEvent.type === 'message') {
                dataModel.data = data;
                if (trackingLiveData()) {
                    var newDomain = sc.util.shiftToLiveData(dataModel.viewDomain, dataModel.data);
                    onViewChanged(newDomain);
                }
            }
            render();
        })
        .on('dataLoaded', function(err, data) {
            if (err) {
                console.log('Error getting historic data: ' + err);
            } else {
                dataModel.data = data;
                resetToLive();
                render();
            }
        });

    var mainMenu = sc.menu.main()
        .on('primaryChartSeriesChange', function(series) {
            primaryChart.changeSeries(series);
            /* Elements are drawn in the order they appear in the HTML - at this minute,
            D3FC doesn't maintain the ordering of elements, so it's easiest to just
            remove them and re-write them to the DOM in the correct order. */
            svgPrimary.selectAll('.multi')
                .remove();
            render();
        })
        .on('primaryChartIndicatorChange', function(indicator) {
            primaryChart.toggleIndicator(indicator);
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
        })
        .on('dataTypeChange', function(type) {
            if (type === 'bitcoin') {
                dataModel.period = container.select('#period-selection').property('value');
                dataInterface(dataModel.period);
            } else if (type === 'generated') {
                dataInterface.generateData();
                dataModel.period = 60 * 60 * 24;
            }
        })
        .on('periodChange', function(period) {
            dataModel.period = period;
            dataInterface(dataModel.period);
        });

    container.select('.menu')
        .call(mainMenu);

    container.select('#reset-button').on('click', resetToLive);

    d3.select(window).on('resize', resize);

    dataInterface.generateData();
    sc.util.calculateDimensions(container, secondaryChart);
    resetToLive();
})(d3, fc, sc);
