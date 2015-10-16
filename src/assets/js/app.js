(function(d3, fc, sc) {
    'use strict';

    sc.app = function() {

        var app = {};

        var container = d3.select('#app-container');
        var svgPrimary = container.select('svg.primary');
        var svgSecondary = container.selectAll('svg.secondary');
        var svgXAxis = container.select('svg.x-axis');
        var svgNav = container.select('svg.nav');
        var divLegend = container.select('#legend');

        var model = {
            data: [],
            trackingLatest: true,
            viewDomain: []
        };

        var primaryChart = sc.chart.primary();
        var secondaryCharts = [];
        var xAxis = sc.chart.xAxis();
        var nav = sc.chart.nav();
        var headMenu = sc.menu.head();
        var legend = sc.chart.legend();

        function render() {
            svgPrimary.datum(model)
                .call(primaryChart);

            renderLegend();

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

        function renderHeadMenu() {
            container.select('.head-menu')
                .call(headMenu);
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
            model.trackingLatest = sc.util.domain.trackingLatestData(model.viewDomain, model.data);
            render();
        }

        function renderLegend() {
            divLegend.datum(sc.model.legendData)
                .call(legend);
        }

        function onCrosshairChanged(dataPoint) {
            sc.model.legendData = dataPoint;
            render();
        }

        function initialiseChartEventHandlers() {
            primaryChart.on('crosshairChange', onCrosshairChanged);
            primaryChart.on('viewChange', onViewChanged);
            nav.on('viewChange', onViewChanged);
        }

        function resetToLive() {
            var data = model.data;
            var dataDomain = fc.util.extent(data, 'date');
            var navTimeDomain = sc.util.domain.moveToLatest(dataDomain, data, 0.2);
            onViewChanged(navTimeDomain);
        }

        function updateModelData(data) {
            model.data = data;
            sc.model.latestDataPoint = data[data.length - 1];
        }

        function initialiseDataInterface() {
            var dataInterface = sc.data.dataInterface()
                .on('messageReceived', function(socketEvent, data) {
                    if (socketEvent.type === 'error' ||
                        (socketEvent.type === 'close' && socketEvent.code !== 1000)) {
                        console.log('Error loading data from coinbase websocket: ' +
                        socketEvent.type + ' ' + socketEvent.code);
                    } else if (socketEvent.type === 'message') {
                        updateModelData(data);
                        if (model.trackingLatest) {
                            var newDomain = sc.util.domain.moveToLatest(model.viewDomain, model.data);
                            onViewChanged(newDomain);
                        }
                    }
                })
                .on('dataLoaded', function(err, data) {
                    if (err) {
                        console.log('Error getting historic data: ' + err);
                    } else {
                        updateModelData(data);
                        resetToLive();
                    }
                });
            return dataInterface;
        }

        function initialiseHeadMenu(dataInterface) {
            headMenu.on('dataProductChange', function(product) {
                    sc.model.selectedProduct = product.option;
                    sc.model.selectedPeriod = product.option.getPeriods()[0];
                    if (product.option === sc.model.product.bitcoin) {
                        dataInterface(sc.model.selectedPeriod.seconds);
                    } else if (product.option === sc.model.product.generated) {
                        dataInterface.generateDailyData();
                    }
                    renderHeadMenu();
                })
                .on('dataPeriodChange', function(period) {
                    sc.model.selectedPeriod = period.option;
                    dataInterface(sc.model.selectedPeriod.seconds);
                })
                .on('resetToLive', resetToLive)
                .on('toggleSlideout', function() {
                    container.selectAll('.row-offcanvas-right').classed('active',
                        !container.selectAll('.row-offcanvas-right').classed('active'));
                });

            renderHeadMenu();
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

            dataInterface.generateDailyData();
        };

        return app;
    };
})(d3, fc, sc);
