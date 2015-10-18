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
            viewDomain: [],
            series: sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick()),
            yValueAccessor: {option: function(d) { return d.close; }},
            toggledIndicator: undefined
        };

        var xAxisModel = {
            viewDomain: []
        };

        var navModel = {
            data: [],
            viewDomain: []
        };

        var primaryChart;
        var secondaryCharts = [];
        var xAxis = sc.chart.xAxis();
        var nav;
        var headMenu;
        var legend = sc.chart.legend();

        function render() {
            svgPrimary.datum(model)
                .call(primaryChart);

            divLegend.datum(sc.model.legendData)
                .call(legend);

            svgSecondary.datum(model)
                .filter(function(d, i) { return i < secondaryCharts.length; })
                .each(function(d, i) {
                    d3.select(this)
                        .attr('class', 'chart secondary ' + secondaryCharts[i].valueString)
                        .call(secondaryCharts[i].option);
                });

            svgXAxis.datum(xAxisModel)
                .call(xAxis);

            svgNav.datum(navModel)
                .call(nav);

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

        function onViewChange(domain) {
            model.viewDomain = [domain[0], domain[1]];
            xAxisModel.viewDomain = [domain[0], domain[1]];
            navModel.viewDomain = [domain[0], domain[1]];
            model.trackingLatest = sc.util.domain.trackingLatestData(model.viewDomain, model.data);
            render();
        }

        function onCrosshairChange(dataPoint) {
            sc.model.legendData = dataPoint;
            render();
        }

        function resetToLatest() {
            var data = model.data;
            var dataDomain = fc.util.extent(data, 'date');
            var navTimeDomain = sc.util.domain.moveToLatest(dataDomain, data, 0.2);
            onViewChange(navTimeDomain);
        }

        function updateModelData(data) {
            model.data = data;
            navModel.data = data;
            sc.model.latestDataPoint = data[data.length - 1];
        }

        function initialisePrimaryChart() {
            return sc.chart.primary()
                .on(sc.event.crosshairChange, onCrosshairChange)
                .on(sc.event.viewChange, onViewChange);
        }

        function initialiseNav() {
            return sc.chart.nav()
                .on(sc.event.viewChange, onViewChange);
        }

        function initialiseDataInterface() {
            return sc.data.dataInterface()
                .on(sc.event.messageReceived, function(socketEvent, data) {
                    if (socketEvent.type === 'error' ||
                        (socketEvent.type === 'close' && socketEvent.code !== 1000)) {
                        console.log('Error loading data from coinbase websocket: ' +
                        socketEvent.type + ' ' + socketEvent.code);
                    } else if (socketEvent.type === 'message') {
                        updateModelData(data);
                        if (model.trackingLatest) {
                            var newDomain = sc.util.domain.moveToLatest(model.viewDomain, model.data);
                            onViewChange(newDomain);
                        }
                    }
                })
                .on(sc.event.dataLoaded, function(err, data) {
                    if (err) {
                        console.log('Error getting historic data: ' + err);
                    } else {
                        updateModelData(data);
                        resetToLatest();
                    }
                });
        }

        function initialiseHeadMenu(dataInterface) {
            return sc.menu.head()
                .on(sc.event.dataProductChange, function(product) {
                    sc.model.selectedProduct = product.option;
                    sc.model.selectedPeriod = product.option.getPeriods()[0];
                    if (product.option === sc.model.product.bitcoin) {
                        dataInterface(sc.model.selectedPeriod.seconds);
                    } else if (product.option === sc.model.product.generated) {
                        dataInterface.generateDailyData();
                    }
                    render();
                })
                .on(sc.event.dataPeriodChange, function(period) {
                    sc.model.selectedPeriod = period.option;
                    dataInterface(sc.model.selectedPeriod.seconds);
                })
                .on(sc.event.resetToLatest, resetToLatest)
                .on(sc.event.toggleSlideout, function() {
                    container.selectAll('.row-offcanvas-right').classed('active',
                        !container.selectAll('.row-offcanvas-right').classed('active'));
                });
        }

        function initialiseSideMenu() {
            var sideMenu = sc.menu.side()
                .on(sc.event.primaryChartSeriesChange, function(series) {
                    model.series = series;
                    render();
                })
                .on(sc.event.primaryChartYValueAccessorChange, function(yValueAccessor) {
                    model.yValueAccessor = yValueAccessor;
                    render();
                })
                .on(sc.event.primaryChartIndicatorChange, function(toggledIndicator) {
                    model.toggledIndicator = toggledIndicator;
                    render();
                })
                .on(sc.event.secondaryChartChange, function(toggledChart) {
                    if (secondaryCharts.indexOf(toggledChart.option) !== -1 && !toggledChart.toggled) {
                        secondaryCharts.splice(secondaryCharts.indexOf(toggledChart.option), 1);
                    } else if (toggledChart.toggled) {
                        toggledChart.option.option.on(sc.event.viewChange, onViewChange);
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
            primaryChart = initialisePrimaryChart();
            nav = initialiseNav();

            var dataInterface = initialiseDataInterface();
            headMenu = initialiseHeadMenu(dataInterface);
            initialiseSideMenu();

            initialiseResize();

            updateLayout();

            dataInterface.generateDailyData();
        };

        return app;
    };
})(d3, fc, sc);
