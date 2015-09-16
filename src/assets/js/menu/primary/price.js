(function(d3, fc, sc) {
    'use strict';

    sc.menu.primary.price = function() {

        var dispatch = d3.dispatch('primaryChartPriceChange');

        var open = sc.menu.option('Open', 'open', function(d) { return d.open; });
        var high = sc.menu.option('High', 'high', function(d) { return d.high; });
        var low = sc.menu.option('Low', 'low', function(d) { return d.low; });
        var close = sc.menu.option('Close', 'close', function(d) { return d.close; });

        var options = sc.menu.generator.buttonGroup(3)
            .on('optionChange', function(price) {
                dispatch.primaryChartPriceChange(price);
            });

        var primaryChartPriceMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([open, high, low, close]);
                selection.call(options);
            });
        };

        return d3.rebind(primaryChartPriceMenu, dispatch, 'on');
    };

})(d3, fc, sc);