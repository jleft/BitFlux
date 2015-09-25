(function(d3, fc, sc) {
    'use strict';

    sc.menu.data.period = function() {

        var dispatch = d3.dispatch('dataPeriodChange');

        var hourPeriod = sc.menu.option('1 hr', '3600', 3600);
        var fiveMinutePeriod = sc.menu.option('5 min', '300', 300);
        var oneMinutePeriod = sc.menu.option('1 min', '60', 60);

        var options = sc.menu.generator.dropdownGroup()
            .on('optionChange', function(period) {
                dispatch.dataPeriodChange(period);
            });

        var dataPeriodChangeMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([hourPeriod, fiveMinutePeriod, oneMinutePeriod]);
                selection.call(options);
            });
        };

        return d3.rebind(dataPeriodChangeMenu, dispatch, 'on');
    };
})(d3, fc, sc);