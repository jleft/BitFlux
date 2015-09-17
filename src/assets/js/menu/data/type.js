(function(d3, fc, sc) {
    'use strict';

    sc.menu.data.type = function() {

        var dispatch = d3.dispatch('dataTypeChange');

        var generated = sc.menu.option('Data Generator', 'generated', 'generated');
        var bitcoin = sc.menu.option('Bitcoin Data', 'bitcoin', 'bitcoin');

        var options = sc.menu.generator.dropdownGroup()
            .on('optionChange', function(type) {
                dispatch.dataTypeChange(type);
            });

        var dataTypeChangeMenu = function(selection) {
            selection.each(function() {
                var selection = d3.select(this)
                    .datum([generated, bitcoin]);
                selection.call(options);
            });
        };

        return d3.rebind(dataTypeChangeMenu, dispatch, 'on');
    };

})(d3, fc, sc);