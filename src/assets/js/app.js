/*global window */
(function(d3, fc, sc, window) {
    'use strict';

    sc.app = function() {

        var app = {};

        var appContainer = d3.select('#app-container');
        var chartsContainer = appContainer.select('#charts-container');
        var containers = {
            app: appContainer,
            charts: chartsContainer,
            primary: chartsContainer.select('#primary-container'),
            secondaries: chartsContainer.selectAll('.secondary-container'),
            xAxis: chartsContainer.select('#x-axis-container'),
            navbar: chartsContainer.select('#navbar-container'),
            legend: appContainer.select('#legend'),
            suspendLayout: function(value) {
                var self = this;
                Object.keys(self).forEach(function(key) {
                    if (typeof self[key] !== 'function') {
                        self[key].layoutSuspended(value);
                    }
                });
            }
        };

        var day1 = sc.model.data.period({
            display: 'Daily',
            seconds: 86400,
            d3TimeInterval: {unit: d3.time.day, value: 1},
            timeFormat: '%b %d'});
        var hour1 = sc.model.data.period({
            display: '1 Hr',
            seconds: 3600,
            d3TimeInterval: {unit: d3.time.hour, value: 1},
            timeFormat: '%b %d %Hh'});
        var minute5 = sc.model.data.period({
            display: '5 Min',
            seconds: 300,
            d3TimeInterval: {unit: d3.time.minute, value: 5},
            timeFormat: '%H:%M'});
        var minute1 = sc.model.data.period({
            display: '1 Min',
            seconds: 60,
            d3TimeInterval: {unit: d3.time.minute, value: 1},
            timeFormat: '%H:%M'});

        var generated = sc.model.data.product({
            display: 'Data Generator',
            volumeFormat: '.3s',
            periods: [day1]
        });
        var bitcoin = sc.model.data.product({
            display: 'Bitcoin',
            volumeFormat: '.2f',
            periods: [minute1, minute5, hour1]
        });

        var primaryChartModel = sc.model.chart.primary(generated);
        var secondaryChartModel = sc.model.chart.secondary(generated);
        var selectorsModel = sc.model.menu.selectors();
        var xAxisModel = sc.model.chart.xAxis(day1);
        var navModel = sc.model.chart.nav();
        var navResetModel = sc.model.chart.navigationReset();
        var headMenuModel = sc.model.menu.head([generated, bitcoin], generated, day1);
        var legendModel = sc.model.chart.legend(generated, day1);

        var charts = {
            primary: undefined,
            secondaries: [],
            xAxis: sc.chart.xAxis(),
            navbar: undefined,
            legend: sc.chart.legend()
        };

        var headMenu;
        var navReset;
        var selectors;

        function renderInternal() {
            if (layoutRedrawnInNextRender) {
                containers.suspendLayout(false);
            }

            containers.primary.datum(primaryChartModel)
                .call(charts.primary);

            containers.legend.datum(legendModel)
                .call(charts.legend);

            containers.secondaries.datum(secondaryChartModel)
                // TODO: Add component: group of secondary charts.
                // Then also move method layout.getSecondaryContainer into the group.
                .filter(function(d, i) { return i < charts.secondaries.length; })
                .each(function(d, i) {
                    d3.select(this)
                        .attr('class', 'secondary-container ' + charts.secondaries[i].valueString)
                        .call(charts.secondaries[i].option);
                });

            containers.xAxis.datum(xAxisModel)
                .call(charts.xAxis);

            containers.navbar.datum(navModel)
                .call(charts.navbar);

            containers.app.select('#navbar-reset')
                .datum(navResetModel)
                .call(navReset);

            containers.app.select('.head-menu')
                .datum(headMenuModel)
                .call(headMenu);

            containers.app.select('#selectors')
                .datum(selectorsModel)
                .call(selectors);

            if (layoutRedrawnInNextRender) {
                containers.suspendLayout(true);
                layoutRedrawnInNextRender = false;
            }
        }

        var render = fc.util.render(renderInternal);

        var layoutRedrawnInNextRender = true;

        function updateLayout() {
            layoutRedrawnInNextRender = true;
            sc.util.layout(containers, charts);
        }

        function initialiseResize() {
            d3.select(window).on('resize', function() {
                updateLayout();
                render();
            });
        }

        function onViewChange(domain) {
            var viewDomain = [domain[0], domain[1]];
            primaryChartModel.viewDomain = viewDomain;
            secondaryChartModel.viewDomain = viewDomain;
            xAxisModel.viewDomain = viewDomain;
            navModel.viewDomain = viewDomain;

            var trackingLatest = sc.util.domain.trackingLatestData(
                primaryChartModel.viewDomain,
                primaryChartModel.data);
            primaryChartModel.trackingLatest = trackingLatest;
            secondaryChartModel.trackingLatest = trackingLatest;
            navModel.trackingLatest = trackingLatest;
            navResetModel.trackingLatest = trackingLatest;
            render();
        }

        function onCrosshairChange(dataPoint) {
            legendModel.data = dataPoint;
            render();
        }

        function resetToLatest() {
            var data = primaryChartModel.data;
            var dataDomain = fc.util.extent()
                .fields('date')(data);
            var navTimeDomain = sc.util.domain.moveToLatest(dataDomain, data, 0.2);
            onViewChange(navTimeDomain);
        }

        function loading(isLoading) {
            appContainer.select('#loading-message')
                .classed('hidden', !isLoading);
            appContainer.select('#charts')
                .classed('hidden', isLoading);
        }

        function updateModelData(data) {
            primaryChartModel.data = data;
            secondaryChartModel.data = data;
            navModel.data = data;
        }

        function updateModelSelectedProduct(product) {
            headMenuModel.selectedProduct = product;
            primaryChartModel.product = product;
            secondaryChartModel.product = product;
            legendModel.product = product;
        }

        function updateModelSelectedPeriod(period) {
            headMenuModel.selectedPeriod = period;
            xAxisModel.period = period;
            legendModel.period = period;
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

        function initialiseNavReset() {
            return sc.menu.navigationReset()
                .on(sc.event.resetToLatest, resetToLatest);
        }

        function initialiseDataInterface() {
            return sc.data.dataInterface()
                .on(sc.event.newTrade, function(data) {
                    updateModelData(data);
                    if (primaryChartModel.trackingLatest) {
                        var newDomain = sc.util.domain.moveToLatest(
                          primaryChartModel.viewDomain,
                          primaryChartModel.data);
                        onViewChange(newDomain);
                    }
                })
                .on(sc.event.dataLoaded, function(data) {
                    loading(false);
                    updateModelData(data);
                    legendModel.data = null;
                    resetToLatest();
                    updateLayout();
                })
                .on(sc.event.dataLoadError, function(err) {
                    console.log('Error getting historic data: ' + err); // TODO: something more useful for the user!
                })
                .on(sc.event.webSocketError, function(err) {
                    console.log('Error loading data from websocket: ' + err);
                });
        }

        function initialiseHeadMenu(dataInterface) {
            return sc.menu.head()
                .on(sc.event.dataProductChange, function(product) {
                    loading(true);
                    updateModelSelectedProduct(product.option);
                    updateModelSelectedPeriod(product.option.periods[0]);
                    if (product.option === bitcoin) {
                        dataInterface(product.option.periods[0].seconds);
                    } else if (product.option === generated) {
                        dataInterface.generateDailyData();
                    }
                    render();
                })
                .on(sc.event.dataPeriodChange, function(period) {
                    loading(true);
                    updateModelSelectedPeriod(period.option);
                    dataInterface(period.option.seconds);
                    render();
                });
        }

        function selectOption(optionToSelect, options) {
            options.forEach(function(option) {
                option.isSelected = false;
            });
            optionToSelect.isSelected = true;
        }

        function initialiseSelectors() {
            return sc.menu.selectors()
                .on(sc.event.primaryChartSeriesChange, function(series) {
                    primaryChartModel.series = series;
                    selectOption(series, selectorsModel.seriesSelector.options);
                    render();
                })
                .on(sc.event.primaryChartIndicatorChange, function(indicator) {
                    indicator.isSelected = !indicator.isSelected;
                    primaryChartModel.indicators =
                        selectorsModel.indicatorSelector.indicatorOptions.filter(function(option) {
                            return option.isSelected;
                        });
                    render();
                })
                .on(sc.event.secondaryChartChange, function(chart) {
                    chart.isSelected = !chart.isSelected;
                    charts.secondaries =
                        selectorsModel.indicatorSelector.secondaryChartOptions.filter(function(option) {
                            return option.isSelected;
                        });
                    // TODO: This doesn't seem to be a concern of menu.
                    charts.secondaries.forEach(function(chartOption) {
                        chartOption.option.on(sc.event.viewChange, onViewChange);
                    });
                    // TODO: Remove .remove! (could a secondary chart group component manage this?).
                    containers.secondaries.selectAll('*').remove();
                    updateLayout();
                    render();
                });
        }

        app.run = function() {
            charts.primary = initialisePrimaryChart();
            charts.navbar = initialiseNav();

            var dataInterface = initialiseDataInterface();
            headMenu = initialiseHeadMenu(dataInterface);
            navReset = initialiseNavReset();
            selectors = initialiseSelectors();

            initialiseResize();

            dataInterface.generateDailyData();
        };

        return app;
    };
}(d3, fc, sc, window));
