(function(d3, fc, sc) {
    'use strict';

    sc.menu.data.product = function() {

        var dispatch = d3.dispatch('dataProductChange');

        var generated = sc.menu.option('Data Generator', 'generated', 'generated');
        var bitcoin = sc.menu.option('Bitcoin Data', 'bitcoin', 'bitcoin');

        var options = sc.menu.generator.dropdownGroup()
            .on('optionChange', function(product) {
                dispatch.dataProductChange(product);
            });

        var dataProductChangeMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([generated, bitcoin]);
                selection.call(options);
            });
        };

        return d3.rebind(dataProductChangeMenu, dispatch, 'on');
    };

})(d3, fc, sc);