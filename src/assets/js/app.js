(function(d3, fc, sc) {
    'use strict';

    sc.app = function() {

        var app = {};

        var container = d3.select('#app-container');
        var svgPrimary = container.select('svg.primary');
        var svgSecondary = container.selectAll('svg.secondary');
        var svgXAxis = container.select('svg.x-axis');
        var svgNav = container.select('svg.nav');

        var model = {
            data: [],
            period: 60 * 60 * 24,
            trackingLive: true,
            viewDomain: []
        };

        var primaryChart = sc.chart.primary();
        var secondaryCharts = [];
        var xAxis = sc.chart.xAxis();
        var nav = sc.chart.nav();

        function render() {
            svgPrimary.datum(model)
                .call(primaryChart);

            svgSecondary.datum(model)
                .filter(function(d, i) { return i < secondaryCharts.length; })
                .each(function(d, i) {
                    d3.select(this)
                        .attr('class', 'chart secondary ' + secondaryCharts[i].valueString)
                        .call(secondaryCharts[i].option);
                });

            svgXAxis.datum(model)
                .call(xAxis);

            svgNav.datum(model)
                .call(nav);
        }

        function updateLayout() {
            sc.util.layout(container, secondaryCharts);
        }

        function initialiseResize() {
            d3.select(window).on('resize', function() {
                updateLayout();
                render();
            });
        }

        function onViewChanged(domain) {
            model.viewDomain = [domain[0], domain[1]];
            model.trackingLive = sc.util.domain.trackingLiveData(model.viewDomain, model.data);
            render();
        }

        function initialiseChartEventHandlers() {
            primaryChart.on('viewChange', onViewChanged);
            nav.on('viewChange', onViewChanged);
        }

        function resetToLive() {
            var data = model.data;
            var dataDomain = fc.util.extent(data, 'date');
            var navTimeDomain = sc.util.domain.moveToLatest(dataDomain, data, 0.2);
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
                        model.data = data;
                        if (model.trackingLive) {
                            var newDomain = sc.util.domain.moveToLatest(model.viewDomain, model.data);
                            onViewChanged(newDomain);
                        }
                    }
                })
                .on('dataLoaded', function(err, data) {
                    if (err) {
                        console.log('Error getting historic data: ' + err);
                    } else {
                        model.data = data;
                        resetToLive();
                    }
                });
            return dataInterface;
        }

        function initialiseHeadMenu(dataInterface) {
            var headMenu = sc.menu.head()
                .on('dataTypeChange', function(type) {
                    if (type.option === 'bitcoin') {
                        var periodDropdown = container.select('#period-dropdown');
                        model.period = periodDropdown.selectAll('option')[0]
                            [periodDropdown.node().selectedIndex].__data__.option;
                        dataInterface(model.period);
                    } else if (type.option === 'generated') {
                        dataInterface.generateData();
                        model.period = 60 * 60 * 24;
                    }
                })
                .on('dataPeriodChange', function(period) {
                    model.period = period.option;
                    dataInterface(model.period);
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
                    render();
                })
                .on('primaryChartYValueAccessorChange', function(yValueAccessor) {
                    primaryChart.changeYValueAccessor(yValueAccessor);
                    render();
                })
                .on('primaryChartIndicatorChange', function(toggledIndicator) {
                    primaryChart.toggleIndicator(toggledIndicator);
                    render();
                })
                .on('secondaryChartChange', function(toggledChart) {
                    if (secondaryCharts.indexOf(toggledChart.option) !== -1 && !toggledChart.toggled) {
                        secondaryCharts.splice(secondaryCharts.indexOf(toggledChart.option), 1);
                    } else if (toggledChart.toggled) {
                        toggledChart.option.option.on('viewChange', onViewChanged);
                        secondaryCharts.push(toggledChart.option);
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

            updateLayout();

            dataInterface.generateData();
        };

        return app;
    };
})(d3, fc, sc);
