(function(d3, fc, sc) {
    'use strict';

    sc.menu.primaryChart.indicators = function() {

        var dispatch = d3.dispatch('primaryChartIndicatorChange');
        var indicators;

        var options = sc.menu.indicatorChoice()
            .on('indicatorSelect', function(indicator) {
                dispatch.primaryChartIndicatorChange(indicator);
            });

        var primaryChartSeriesMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .data([indicators]);
                selection.call(options);
            });
        };

        primaryChartSeriesMenu.indicators = function(x) {
            if (!arguments.length) {
                return indicators;
            }
            indicators = x;
            return primaryChartSeriesMenu;
        };

        return d3.rebind(primaryChartSeriesMenu, dispatch, 'on');
    };
})(d3, fc, sc);