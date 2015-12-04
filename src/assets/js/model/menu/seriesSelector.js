(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.seriesSelector = function() {

        var candlestick = sc.series.candlestick();
        candlestick.id = sc.util.uid();
        var candlestickOption = sc.model.menu.option(
            'Candlestick',
            'candlestick',
            candlestick,
            'sc-icon-candlestick-series');
        candlestickOption.isSelected = true;

        var ohlc = fc.series.ohlc();
        ohlc.id = sc.util.uid();

        var line = fc.series.line();
        line.id = sc.util.uid();

        var point = fc.series.point();
        point.id = sc.util.uid();

        var area = fc.series.area();
        area.id = sc.util.uid();

        return {
            config: {
                title: null,
                careted: false,
                listIcons: true,
                icon: true
            },
            options: [
                candlestickOption,
                sc.model.menu.option('OHLC', 'ohlc', ohlc, 'sc-icon-ohlc-series'),
                sc.model.menu.option('Line', 'line', line, 'sc-icon-line-series'),
                sc.model.menu.option('Point', 'point', point, 'sc-icon-point-series'),
                sc.model.menu.option('Area', 'area', area, 'sc-icon-area-series')
            ]
        };
    };

}(d3, fc, sc));
