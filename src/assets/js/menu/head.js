(function(d3, fc, sc) {
    'use strict';

    sc.menu.head = function() {

        var dispatch = d3.dispatch(
            sc.event.resetToLatest,
            sc.event.toggleSlideout,
            sc.event.dataProductChange,
            sc.event.dataPeriodChange);

        function setPeriodChangeVisibility(visible) {
            var visibility = visible ? 'visible' : 'hidden';
            d3.select('#period-dropdown')
                .style('visibility', visibility);
        }

        var dataProductDropdown = sc.menu.group()
            .generator(sc.menu.generator.dropdownGroup())
            .on('optionChange', function(product) {
                dispatch[sc.event.dataProductChange](product);
            });

        var dataPeriodDropdown = sc.menu.group()
            .generator(sc.menu.generator.dropdownGroup())
            .on('optionChange', function(period) {
                dispatch[sc.event.dataPeriodChange](period);
            });

        function configureDropdown() {
            dataProductDropdown.formOptionListFromCollection(sc.model.products, sc.menu.productAdaptor);
            var periods = sc.model.selectedProduct.getPeriods();
            dataPeriodDropdown.formOptionListFromCollection(
                periods,
                sc.menu.periodAdaptor);
            setPeriodChangeVisibility(periods.length > 1);
        }

        var head = function(selection) {
            configureDropdown();
            selection.each(function() {
                var selection = d3.select(this);
                selection.select('#product-dropdown')
                    .datum({selectedIndex: sc.model.products.indexOf(sc.model.selectedProduct)})
                    .call(dataProductDropdown);
                selection.select('#period-dropdown')
                    .call(dataPeriodDropdown);
                selection.select('#reset-button')
                    .on('click', function() {
                        dispatch[sc.event.resetToLatest]();
                    });
                selection.select('#toggle-button')
                    .on('click', function() {
                        dispatch[sc.event.toggleSlideout]();
                    });
            });
        };

        return d3.rebind(head, dispatch, 'on');
    };
})(d3, fc, sc);
