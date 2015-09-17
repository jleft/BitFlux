(function(d3, fc, sc) {
    'use strict';

    sc.menu.generator.dropdownGroup = function() {
        var dispatch = d3.dispatch('optionChange');

        function layoutDropdown(sel) {
            sel.selectAll('option')
                .data(sel.datum())
                .enter()
                .append('option')
                .text(function(d, i) { return d.displayString; })
                .attr({
                    value: function(d, i) { return d.valueString; }
                })
                .property('selected', function(d, i) { return (i === 0); });
        }

        function optionGenerator(selection) {
            selection.call(layoutDropdown);

            selection.on('change', function() {
                    var selectedOption = d3.select(this).selectAll('option')[0][this.selectedIndex].__data__;
                    dispatch.optionChange(selectedOption);
                });
        }

        d3.rebind(optionGenerator, dispatch, 'on');

        return optionGenerator;
    };

})(d3, fc, sc);