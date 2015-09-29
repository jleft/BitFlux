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

        var dataProductChangeOptions = sc.menu.data.product()
            .on('dataProductChange', function(product) {
                if (product.option === 'bitcoin') {
                    setPeriodChangeVisibility(true);
                } else {
                    setPeriodChangeVisibility(false);
                }
                dispatch.dataProductChange(product);
            });

        var dataPeriodChangeOptions = sc.menu.data.period()
            .on('dataPeriodChange', function(period) {
                dispatch.dataPeriodChange(period);
            });

        var head = function(selection) {
            selection.each(function() {
                var selection = d3.select(this);
                selection.select('#product-dropdown')
                    .call(dataProductChangeOptions);
                selection.select('#period-dropdown')
                    .call(dataPeriodChangeOptions);
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