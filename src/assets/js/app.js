(function(d3, fc, sc) {
    'use strict';

    sc.app = function() {

        var app = {};

        var container = d3.select('#app-container');
        var svgPrimary = container.select('svg.primary');
        var svgSecondary = container.selectAll('svg.secondary');
        var svgXAxis = container.select('svg.x-axis');
        var svgNav = container.select('svg.nav');

        var dataModel = {
            data: [],
            period: 60 * 60 * 24,
            trackingLive: true,
            viewDomain: []
        };

        var primaryChart = sc.chart.primaryChart();
        var secondaryChart = [];
        var xAxis = sc.chart.xAxis();
        var navChart = sc.chart.navChart();

        function render() {
            svgPrimary.datum(dataModel)
                .call(primaryChart);

            svgSecondary.datum(dataModel)
                .filter(function(d, i) { return i < secondaryChart.length; })
                .each(function(d, i) {
                    d3.select(this).call(secondaryChart[i]);
                });

            svgXAxis.datum(dataModel)
                .call(xAxis);

            svgNav.datum(dataModel)
                .call(navChart);
        }

        function updateLayout() {
            sc.util.dimensions.layout(container, secondaryChart);
        }

        function initialiseResize() {
            d3.select(window).on('resize', function() {
                updateLayout();
                render();
            });
        }

        function onViewChanged(domain) {
            dataModel.viewDomain = [domain[0], domain[1]];
            dataModel.trackingLive = sc.util.domain.trackingLiveData(dataModel.viewDomain, dataModel.data);
            render();
        }

        function initialiseChartEventHandlers() {
            primaryChart.on('viewChange', onViewChanged);
            navChart.on('viewChange', onViewChanged);
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

        function initialiseDataInterface() {
            var dataInterface = sc.data.dataInterface()
                .on('messageReceived', function(socketEvent, data) {
                    if (socketEvent.type === 'error' ||
                        (socketEvent.type === 'close' && socketEvent.code !== 1000)) {
                        console.log('Error loading data from coinbase websocket: ' +
                        socketEvent.type + ' ' + socketEvent.code);
                    } else if (socketEvent.type === 'message') {
                        dataModel.data = data;
                        if (dataModel.trackingLive) {
                            var newDomain = sc.util.domain.shiftToLiveData(dataModel.viewDomain, dataModel.data);
                            onViewChanged(newDomain);
                        }
                    }
                })
                .on('dataLoaded', function(err, data) {
                    if (err) {
                        console.log('Error getting historic data: ' + err);
                    } else {
                        dataModel.data = data;
                        resetToLive();
                    }
                });
            return dataInterface;
        }

        function initialiseHeadMenu(dataInterface) {
            var headMenu = sc.menu.head()
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
                })
                .on('resetToLive', resetToLive)
                .on('toggleSlideout', function() {
                    container.selectAll('.row-offcanvas-right').classed('active',
                        !container.selectAll('.row-offcanvas-right').classed('active'));
                });

            container.select('.head-menu')
                .call(headMenu);
        }

        function initialiseSideMenu() {
            var sideMenu = sc.menu.side()
                .on('primaryChartSeriesChange', function(series) {
                    primaryChart.changeSeries(series);
                    /* Elements are drawn in the order they appear in the HTML - at this minute,
                    D3FC doesn't maintain the ordering of elements, so it's easiest to just
                    remove them and re-write them to the DOM in the correct order. */
                    svgPrimary.selectAll('.multi')
                        .remove();
                    render();
                })
                .on('primaryChartIndicatorChange', function(toggledIndicator) {
                    primaryChart.toggleIndicator(toggledIndicator);
                    svgPrimary.selectAll('.multi')
                        .remove();
                    render();
                })
                .on('secondaryChartChange', function(toggledChart) {
                    if (secondaryChart.indexOf(toggledChart.option.option) !== -1 && !toggledChart.toggled) {
                        secondaryChart.splice(secondaryChart.indexOf(toggledChart.option.option), 1);
                    } else if (toggledChart.toggled) {
                        toggledChart.option.option.on('viewChange', onViewChanged);
                        secondaryChart.push(toggledChart.option.option);
                    }
                    svgSecondary.selectAll('*').remove();
                    updateLayout();
                    render();
                });

            container.select('.sidebar-menu')
                .call(sideMenu);
        }

        app.run = function() {
            initialiseChartEventHandlers();

            var dataInterface = initialiseDataInterface();
            initialiseHeadMenu(dataInterface);
            initialiseSideMenu();

            initialiseResize();

            dataInterface.generateData();

            updateLayout();

            resetToLive();
        };

        return app;
    };


})(d3, fc, sc);
