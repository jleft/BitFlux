(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.seriesSelector = function() {

        // TODO: Could 'isLine' go on primary chart series model instead?
        var line = fc.series.line();
        line.isLine = true;

        var candlestickOption = sc.menu.option(
            'Candlestick',
            'candlestick',
            sc.series.candlestick(),
            'sc-icon-candlestick-series');
        candlestickOption.isSelected = true;

        return {
            config: {
                title: null,
                careted: false,
                listIcons: true,
                icon: true
            },
            options: [
                candlestickOption,
                sc.menu.option('OHLC', 'ohlc', fc.series.ohlc(), 'sc-icon-ohlc-series'),
                sc.menu.option('Line', 'line', line, 'sc-icon-line-series'),
                sc.menu.option('Point', 'point', fc.series.point(), 'sc-icon-point-series'),
                sc.menu.option('Area', 'area', fc.series.area(), 'sc-icon-area-series')
            ]};
    };

})(d3, fc, sc);
