(function(d3, fc, sc) {
    'use strict';

    sc.menu.head = function() {

        var dispatch = d3.dispatch(
            sc.event.resetToLatest,
            sc.event.toggleSlideout,
            sc.event.dataProductChange,
            sc.event.dataPeriodChange);

        var dataProductDropdown = sc.menu.generator.dropdownGroup()
            .on('optionChange', function(product) {
                dispatch[sc.event.dataProductChange](product);
            });

        var dataPeriodDropdown = sc.menu.generator.dropdownGroup()
            .on('optionChange', function(period) {
                dispatch[sc.event.dataPeriodChange](period);
            });

        var head = function(selection) {
            selection.each(function(model) {
                var selection = d3.select(this);

                selection.select('#product-dropdown')
                    .datum({
                        // TODO: No global model, use bound model instead.
                        optionList: sc.model.products.map(sc.menu.productAdaptor),
                        selectedIndex: sc.model.products.indexOf(sc.model.selectedProduct)
                    })
                    .call(dataProductDropdown);

                var periods = sc.model.selectedProduct.getPeriods();
                selection.select('#period-dropdown')
                    .style('visibility', periods.length > 1 ? 'visible' : 'hidden') // TODO: get from model instead?
                    .datum({optionList: periods.map(sc.menu.periodAdaptor)})
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
