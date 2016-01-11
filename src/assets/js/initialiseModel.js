import d3 from 'd3';
import fc from 'd3fc';
import model from './model/model';
import chart from './chart/chart';
import util from './util/util';
import candlestickSeries from './series/candlestick';
import dataGeneratorAdaptor from './data/generator/historic/feedAdaptor';
import coinbaseAdaptor from './data/coinbase/historic/feedAdaptor';
import coinbaseHistoricErrorResponseFormatter from './data/coinbase/historic/errorResponseFormatter';
import coinbaseWebSocket from './data/coinbase/streaming/webSocket';
import coinbaseStreamingErrorResponseFormatter from './data/coinbase/streaming/errorResponseFormatter';
import quandlAdaptor from './data/quandl/historic/feedAdaptor';
import quandlHistoricErrorResponseFormatter from './data/quandl/historic/errorResponseFormatter';
import notification from './notification/notification';
import coinbaseGetProducts from './data/coinbase/getProducts';
import coninbaseFormatProducts from './data/coinbase/formatProducts';
import messageModel from './model/notification/message';

export default function(app) {
    var initialModel = {};

    function initPeriods() {
        return {
            week1: model.data.period('Weekly', 60 * 60 * 24 * 7, {unit: d3.time.week, value: 1}, '%b %d'),
            day1: model.data.period('Daily', 60 * 60 * 24, {unit: d3.time.day, value: 1}, '%b %d'),
            hour1: model.data.period('1 Hr', 60 * 60, {unit: d3.time.hour, value: 1}, '%b %d %Hh'),
            minute5: model.data.period('5 Min', 60 * 5, {unit: d3.time.minute, value: 5}, '%H:%M'),
            minute1: model.data.period('1 Min', 60, {unit: d3.time.minute, value: 1}, '%H:%M')
        };
    }

    function initSources() {
        return {
            generated: model.data.source(dataGeneratorAdaptor(), null, null),
            bitcoin: model.data.source(coinbaseAdaptor(), coinbaseHistoricErrorResponseFormatter, coinbaseWebSocket(),
                coinbaseStreamingErrorResponseFormatter),
            quandl: model.data.source(quandlAdaptor(), quandlHistoricErrorResponseFormatter, null, null)
        };
    }

    function initProducts() {
        return {
            generated: model.data.product(null, 'Data Generator', [periods.day1], sources.generated, '.3s'),
            quandl: model.data.product('GOOG', 'GOOG', [periods.day1, periods.week1], sources.quandl, '.3s')
        };
    }

    function initSeriesSelector() {
        var candlestick = candlestickSeries();
        candlestick.id = util.uid();

        var candlestickOption = model.menu.option('Candlestick', 'candlestick',
            candlestick, 'sc-icon-candlestick-series');
        candlestickOption.isSelected = true;

        var ohlc = fc.series.ohlc();
        ohlc.id = util.uid();

        var line = fc.series.line();
        line.id = util.uid();

        var point = fc.series.point();
        point.id = util.uid();

        var area = fc.series.area();
        area.id = util.uid();

        var config = model.menu.dropdownConfig(null, false, true, true);

        var options = [
            candlestickOption,
            model.menu.option('OHLC', 'ohlc', ohlc, 'sc-icon-ohlc-series'),
            model.menu.option('Line', 'line', line, 'sc-icon-line-series'),
            model.menu.option('Point', 'point', point, 'sc-icon-point-series'),
            model.menu.option('Area', 'area', area, 'sc-icon-area-series')
        ];

        return model.menu.selector(config, options);
    }

    function initIndicatorOptions() {
        var secondary = chart.secondary;

        var movingAverage = fc.series.line()
            .decorate(function(select) {
                select.enter()
                    .classed('movingAverage', true);
            })
            .yValue(function(d) { return d.movingAverage; });
        movingAverage.id = util.uid();

        var bollingerBands = fc.indicator.renderer.bollingerBands();
        bollingerBands.id = util.uid();

        var indicators = [
            model.menu.option('Moving Average', 'movingAverage',
                movingAverage, 'sc-icon-moving-average-indicator', true),
            model.menu.option('Bollinger Bands', 'bollinger',
                bollingerBands, 'sc-icon-bollinger-bands-indicator', true),
            model.menu.option('Relative Strength Index', 'secondary-rsi',
                secondary.rsi(), 'sc-icon-rsi-indicator', false),
            model.menu.option('MACD', 'secondary-macd',
                secondary.macd(), 'sc-icon-macd-indicator', false),
            model.menu.option('Volume', 'secondary-volume',
                secondary.volume(), 'sc-icon-bar-series', false)
        ];

        return indicators;
    }

    function initIndicatorSelector() {
        var config = model.menu.dropdownConfig('Add Indicator', false, true);

        return model.menu.selector(config, initIndicatorOptions());
    }

    function initSelectors() {
        return {
            seriesSelector: initSeriesSelector(),
            indicatorSelector: initIndicatorSelector()
        };
    }

    var periods = initPeriods();
    var sources = initSources();
    var products = initProducts();

    coinbaseGetProducts(function(error, bitcoinProducts) {
        if (error) {
            var statusText = error.statusText || 'Unknown reason.';
            var message = 'Error retrieving Coinbase products: ' + statusText;
            app.updateModel(function(appModel) {
                appModel.notificationMessages.messages.unshift(messageModel(message));
            });
        } else {
            var defaultPeriods = [periods.hour1, periods.day1];
            var productPeriodOverrides = d3.map();
            productPeriodOverrides.set('BTC-USD', [periods.minute1, periods.minute5, periods.hour1, periods.day1]);
            var formattedProducts = coninbaseFormatProducts(bitcoinProducts, sources.bitcoin, defaultPeriods, productPeriodOverrides);

            app.updateModel(function(appModel) {
                appModel.headMenu.products = appModel.headMenu.products.concat(formattedProducts);
            });
        }
    });

    initialModel.periods = periods; // TODO: remove if unused
    initialModel.sources = sources; // TODO: remove if unused
    initialModel.primaryChart = model.chart.primary(products.generated);
    initialModel.secondaryChart = model.chart.secondary(products.generated);
    initialModel.selectors = initSelectors();
    initialModel.xAxis = model.chart.xAxis(periods.day1);
    initialModel.nav = model.chart.nav();
    initialModel.navReset = model.chart.navigationReset();
    initialModel.headMenu = model.menu.head([products.generated, products.quandl], products.generated, periods.day1);
    initialModel.legend = model.chart.legend(products.generated, periods.day1);
    initialModel.overlay = model.menu.overlay();
    initialModel.notificationMessages = model.notification.messages();

    return initialModel;
}
