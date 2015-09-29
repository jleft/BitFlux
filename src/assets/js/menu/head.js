(function(d3, fc, sc) {
    'use strict';

    sc.menu.head = function() {

        var dispatch = d3.dispatch('resetToLive',
            'toggleSlideout',
            'dataProductChange',
            'dataPeriodChange');

        function setPeriodChangeVisibility(visible) {
            var visibility = visible ? 'visible' : 'hidden';
            d3.select('#period-dropdown')
                .style('visibility', visibility);
        }

        setPeriodChangeVisibility(false);

        var generated = sc.menu.option('Data Generator', 'generated', 'generated');
        var bitcoin = sc.menu.option('Bitcoin Data', 'bitcoin', 'bitcoin');

        var dataProductDropdown = sc.menu.group()
            .option(generated, bitcoin)
            .generator(sc.menu.generator.dropdownGroup())
            .on('optionChange', function(product) {
                if (product.option === 'bitcoin') {
                    setPeriodChangeVisibility(true);
                } else {
                    setPeriodChangeVisibility(false);
                }
                dispatch.dataProductChange(product);
            });

        var hourPeriod = sc.menu.option('1 hr', '3600', 3600);
        var fiveMinutePeriod = sc.menu.option('5 min', '300', 300);
        var oneMinutePeriod = sc.menu.option('1 min', '60', 60);

        var dataPeriodDropdown = sc.menu.group()
            .option(hourPeriod, fiveMinutePeriod, oneMinutePeriod)
            .generator(sc.menu.generator.dropdownGroup())
            .on('optionChange', function(period) {
                dispatch.dataPeriodChange(period);
            });

        var head = function(selection) {
            selection.each(function() {
                var selection = d3.select(this);
                selection.select('#product-dropdown')
                    .call(dataProductDropdown);
                selection.select('#period-dropdown')
                    .call(dataPeriodDropdown);
                selection.select('#reset-button')
                    .on('click', function() {
                        dispatch.resetToLive();
                    });
                selection.select('#toggle-button')
                    .on('click', function() {
                        dispatch.toggleSlideout();
                    });
            });
        };

        return d3.rebind(head, dispatch, 'on');
    };
})(d3, fc, sc);