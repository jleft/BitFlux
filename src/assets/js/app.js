/*global window */
import d3 from 'd3';
import fc from 'd3fc';
import chart from './chart/chart';
import menu from './menu/menu';
import util from './util/util';
import event from './event';
import dataInterface from './data/dataInterface';
import notification from './notification/notification';
import messageModel from './model/notification/message';
import dataModel from './model/data/data';
import coinbaseStreamingErrorResponseFormatter from './data/coinbase/streaming/errorResponseFormatter';
import initialiseModel from './initialiseModel';

export default function(initialModel) {

    var appTemplate = '<div class="container-fluid"> \
        <div id="notifications"></div> \
        <div class="row head-menu head-row"> \
            <div class="col-md-12 head-sub-row"> \
                <div id="product-dropdown" class="dropdown product-dropdown"></div> \
                <div id="period-selector" class="hidden-xs hidden-sm"></div> \
                <div id="mobile-period-selector" class="hidden-md hidden-lg dropdown"></div> \
                <span id="clear-indicators" class="icon sc-icon-delete delete-button hidden-md hidden-lg"></span> \
            </div> \
        </div> \
        <div class="row primary-row"> \
            <div class="col-md-12" id="loading-status-message"> \
                <p class="content">Loading...</p> \
            </div> \
            <div id="charts" class="col-md-12 hidden"> \
                <div id="charts-container"> \
                    <svg id="primary-container"></svg> \
                    <svg class="secondary-container"></svg> \
                    <svg class="secondary-container"></svg> \
                    <svg class="secondary-container"></svg> \
                    <div class="x-axis-row"> \
                        <svg id="x-axis-container"></svg> \
                    </div> \
                    <div id="navbar-row" class="hidden-xs hidden-sm"> \
                        <svg id="navbar-container"></svg> \
                        <svg id="navbar-reset"></svg> \
                    </div> \
                </div> \
                <div id="overlay"> \
                    <div id="overlay-primary-container"> \
                        <div id="overlay-primary-head"> \
                            <div id="selectors"> \
                                <div id="series-dropdown" class="dropdown selector-dropdown"></div> \
                                <div id="indicator-dropdown" class="dropdown selector-dropdown"></div> \
                            </div> \
                            <div id="legend" class="hidden-xs hidden-sm"></div> \
                        </div> \
                        <div id="overlay-primary-bottom"> \
                            <div class="edit-indicator-container"></div> \
                        </div> \
                    </div> \
                    <div class="overlay-secondary-container"> \
                        <div class="edit-indicator-container"></div> \
                    </div> \
                    <div class="overlay-secondary-container"> \
                        <div class="edit-indicator-container"></div> \
                    </div> \
                    <div class="overlay-secondary-container"> \
                        <div class="edit-indicator-container"></div> \
                    </div> \
                    <div class="x-axis-row"></div> \
                    <div id="overlay-navbar-row" class="hidden-xs hidden-sm"></div> \
                </div> \
            </div> \
        </div> \
    </div>';

    var app = {};

    var containers;

    var model = initialModel || initialiseModel(app);

    var _dataInterface;

    var charts = {
        primary: undefined,
        secondaries: [],
        xAxis: chart.xAxis(),
        navbar: undefined,
        legend: chart.legend()
    };

    var overlay;
    var headMenu;
    var navReset;
    var selectors;
    var toastNotifications;

    var rendered = false;
    function renderInternal() {
        if (!rendered) {
            rendered = true;
        }
        if (layoutRedrawnInNextRender) {
            containers.suspendLayout(false);
        }

        containers.primary.datum(model.primaryChart)
            .call(charts.primary);

        containers.legend.datum(model.legend)
            .call(charts.legend);

        containers.secondaries.datum(model.secondaryChart)
            // TODO: Add component: group of secondary charts.
            // Then also move method layout.getSecondaryContainer into the group.
            .filter(function(d, i) { return i < charts.secondaries.length; })
            .each(function(d, i) {
                d3.select(this)
                    .attr('class', 'secondary-container ' + charts.secondaries[i].valueString)
                    .call(charts.secondaries[i].option);
            });

        containers.xAxis.datum(model.xAxis)
            .call(charts.xAxis);

        containers.navbar.datum(model.nav)
            .call(charts.navbar);

        containers.app.select('#navbar-reset')
            .datum(model.navReset)
            .call(navReset);

        containers.app.select('.head-menu')
            .datum(model.headMenu)
            .call(headMenu);

        containers.app.select('#selectors')
            .datum(model.selectors)
            .call(selectors);

        containers.app.select('#notifications')
            .datum(model.notificationMessages)
            .call(toastNotifications);

        containers.overlay.datum(model.overlay)
            .call(overlay);

        if (layoutRedrawnInNextRender) {
            containers.suspendLayout(true);
            layoutRedrawnInNextRender = false;
        }
    }

    var render = fc.util.render(renderInternal);

    var layoutRedrawnInNextRender = true;

    function updateLayout() {
        layoutRedrawnInNextRender = true;
        util.layout(containers, charts);
    }

    function initialiseResize() {
        d3.select(window).on('resize', function() {
            updateLayout();
            render();
        });
    }

    function addNotification(message) {
        model.notificationMessages.messages.unshift(messageModel(message));
    }

    function onViewChange(domain) {
        var viewDomain = [domain[0], domain[1]];
        model.primaryChart.viewDomain = viewDomain;
        model.secondaryChart.viewDomain = viewDomain;
        model.xAxis.viewDomain = viewDomain;
        model.nav.viewDomain = viewDomain;

        var trackingLatest = util.domain.trackingLatestData(
            model.primaryChart.viewDomain,
            model.primaryChart.data);
        model.primaryChart.trackingLatest = trackingLatest;
        model.secondaryChart.trackingLatest = trackingLatest;
        model.nav.trackingLatest = trackingLatest;
        model.navReset.trackingLatest = trackingLatest;
        render();
    }

    function onPrimaryIndicatorChange(indicator) {
        indicator.isSelected = !indicator.isSelected;
        updatePrimaryChartIndicators();
        render();
    }

    function onSecondaryChartChange(_chart) {
        _chart.isSelected = !_chart.isSelected;
        updateSecondaryCharts();
        render();
    }

    function onCrosshairChange(dataPoint) {
        model.legend.data = dataPoint;
        render();
    }

    function onStreamingFeedCloseOrError(streamingEvent, source) {
        var message;
        if (source.streamingNotificationFormatter) {
            message = source.streamingNotificationFormatter(streamingEvent);
        } else {
            // #515 (https://github.com/ScottLogic/d3fc-showcase/issues/515)
            // (TODO) prevents errors when formatting streaming close/error messages when product changes.
            // As we only have a coinbase streaming source at the moment, this is a suitable fix for now
            message = coinbaseStreamingErrorResponseFormatter(streamingEvent);
        }
        if (message) {
            addNotification(message);
            render();
        }
    }

    function resetToLatest() {
        var data = model.primaryChart.data;
        var dataDomain = fc.util.extent()
            .fields('date')(data);
        var navTimeDomain = util.domain.moveToLatest(dataDomain, data, 0.2);
        onViewChange(navTimeDomain);
    }

    function loading(isLoading, error) {
        containers.app.select('#loading-status-message')
            .classed('hidden', !(isLoading || error))
            .select('.content')
            .text(error || 'Loading...');
        containers.app.select('#charts')
            .classed('hidden', isLoading || error);
    }

    function updateModelData(data) {
        model.primaryChart.data = data;
        model.secondaryChart.data = data;
        model.nav.data = data;
    }

    function updateModelSelectedProduct(product) {
        model.headMenu.selectedProduct = product;
        model.primaryChart.product = product;
        model.secondaryChart.product = product;
        model.legend.product = product;
    }

    function updateModelSelectedPeriod(period) {
        model.headMenu.selectedPeriod = period;
        model.xAxis.period = period;
        model.legend.period = period;
    }

    function changeProduct(product) {
        loading(true);
        updateModelSelectedProduct(product);
        updateModelSelectedPeriod(product.periods[0]);
        _dataInterface(product.periods[0].seconds, product);
    }

    function initialisePrimaryChart() {
        return chart.primary()
            .on(event.crosshairChange, onCrosshairChange)
            .on(event.viewChange, onViewChange);
    }

    function initialiseNav() {
        return chart.nav()
            .on(event.viewChange, onViewChange);
    }

    function initialiseNavReset() {
        return menu.navigationReset()
            .on(event.resetToLatest, resetToLatest);
    }

    function initialiseDataInterface() {
        return dataInterface()
            .on(event.newTrade, function(data, source) {
                updateModelData(data);
                if (model.primaryChart.trackingLatest) {
                    var newDomain = util.domain.moveToLatest(
                        model.primaryChart.viewDomain,
                        model.primaryChart.data);
                    onViewChange(newDomain);
                }
            })
            .on(event.historicDataLoaded, function(data, source) {
                loading(false);
                updateModelData(data);
                model.legend.data = null;
                resetToLatest();
                updateLayout();
            })
            .on(event.historicFeedError, function(err, source) {
                loading(false, 'Error loading data. Please make your selection again, or refresh the page.');
                var responseText = '';
                try {
                    var responseObject = JSON.parse(err.responseText);
                    var formattedMessage = source.historicNotificationFormatter(responseObject);
                    if (formattedMessage) {
                        responseText = '. ' + formattedMessage;
                    }
                } catch (e) {
                    responseText = '';
                }
                var statusText = err.statusText || 'Unknown reason.';
                var message = 'Error getting historic data: ' + statusText + responseText;

                addNotification(message);
                render();
            })
            .on(event.streamingFeedError, onStreamingFeedCloseOrError)
            .on(event.streamingFeedClose, onStreamingFeedCloseOrError);
    }

    function initialiseHeadMenu() {
        return menu.head()
            .on(event.dataProductChange, function(product) {
                changeProduct(product.option);
                render();
            })
            .on(event.dataPeriodChange, function(period) {
                loading(true);
                updateModelSelectedPeriod(period.option);
                _dataInterface(period.option.seconds);
                render();
            })
            .on(event.clearAllPrimaryChartIndicatorsAndSecondaryCharts, function() {
                model.primaryChart.indicators.forEach(deselectOption);
                charts.secondaries.forEach(deselectOption);

                updatePrimaryChartIndicators();
                updateSecondaryCharts();
                render();
            });
    }

    function selectOption(option, options) {
        options.forEach(function(_option) {
            _option.isSelected = false;
        });
        option.isSelected = true;
    }

    function deselectOption(option) { option.isSelected = false; }

    function initialiseSelectors() {
        return menu.selectors()
            .on(event.primaryChartSeriesChange, function(series) {
                model.primaryChart.series = series;
                selectOption(series, model.selectors.seriesSelector.options);
                render();
            })
            .on(event.primaryChartIndicatorChange, onPrimaryIndicatorChange)
            .on(event.secondaryChartChange, onSecondaryChartChange);
    }

    function updatePrimaryChartIndicators() {
        model.primaryChart.indicators =
            model.selectors.indicatorSelector.options.filter(function(option) {
                return option.isSelected && option.isPrimary;
            });

        model.overlay.primaryIndicators = model.primaryChart.indicators;
    }

    function updateSecondaryCharts() {
        charts.secondaries =
            model.selectors.indicatorSelector.options.filter(function(option) {
                return option.isSelected && !option.isPrimary;
            });
        // TODO: This doesn't seem to be a concern of menu.
        charts.secondaries.forEach(function(chartOption) {
            chartOption.option.on(event.viewChange, onViewChange);
        });

        model.overlay.secondaryIndicators = charts.secondaries;
        // TODO: Remove .remove! (could a secondary chart group component manage this?).
        containers.secondaries.selectAll('*').remove();
        updateLayout();
    }

    function initialiseOverlay() {
        return menu.overlay()
            .on(event.primaryChartIndicatorChange, onPrimaryIndicatorChange)
            .on(event.secondaryChartChange, onSecondaryChartChange);
    }

    function onNotificationClose(id) {
        model.notificationMessages.messages = model.notificationMessages.messages.filter(function(message) { return message.id !== id; });
        render();
    }

    function initialiseNotifications() {
        return notification.toast()
            .on(event.notificationClose, onNotificationClose);
    }

    app.updateModel = function(callback) {
        callback.call(this, model);
        if (rendered) {
            render();
        }
    };

    app.changeQuandlProduct = function(productString) {
        var product = dataModel.product(productString, productString, [model.periods.day1], model.sources.quandl, '.3s');
        var existsInHeadMenuProducts = model.headMenu.products.some(function(p) { return p.id === product.id; });

        if (!existsInHeadMenuProducts) {
            model.headMenu.products.push(product);
        }

        changeProduct(product);

        if (rendered) {
            render();
        }
    };

    app.run = function(element) {
        var appContainer = d3.select(element);
        // TODO: Could potentially use d3.html() to load the html from an external file
        appContainer.html(appTemplate);

        var chartsContainer = appContainer.select('#charts-container');
        var overlayContainer = appContainer.select('#overlay');
        containers = {
            app: appContainer,
            charts: chartsContainer,
            primary: chartsContainer.select('#primary-container'),
            secondaries: chartsContainer.selectAll('.secondary-container'),
            xAxis: chartsContainer.select('#x-axis-container'),
            navbar: chartsContainer.select('#navbar-container'),
            overlay: overlayContainer,
            overlaySecondaries: overlayContainer.selectAll('.overlay-secondary-container'),
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

        charts.primary = initialisePrimaryChart();
        charts.navbar = initialiseNav();

        _dataInterface = initialiseDataInterface();
        headMenu = initialiseHeadMenu();
        navReset = initialiseNavReset();
        selectors = initialiseSelectors();
        overlay = initialiseOverlay();
        toastNotifications = initialiseNotifications();

        updateLayout();
        initialiseResize();
        _dataInterface(model.headMenu.selectedPeriod.seconds, model.headMenu.selectedProduct);
    };

    return app;
}
