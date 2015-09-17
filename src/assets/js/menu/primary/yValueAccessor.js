(function(d3, fc, sc) {
    'use strict';

    sc.menu.primary.yValueAccessor = function() {

        var dispatch = d3.dispatch('primaryChartYValueAccessorChange');

        var open = sc.menu.option('Open', 'open', function(d) { return d.open; });
        var high = sc.menu.option('High', 'high', function(d) { return d.high; });
        var low = sc.menu.option('Low', 'low', function(d) { return d.low; });
        var close = sc.menu.option('Close', 'close', function(d) { return d.close; });

        var options = sc.menu.generator.buttonGroup(3)
            .on('optionChange', function(yValueAccessor) {
                dispatch.primaryChartYValueAccessorChange(yValueAccessor);
            });

        var primaryChartYValueAccessorMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([open, high, low, close]);
                selection.call(options);
            });
        };

        return d3.rebind(primaryChartYValueAccessorMenu, dispatch, 'on');
    };

})(d3, fc, sc);