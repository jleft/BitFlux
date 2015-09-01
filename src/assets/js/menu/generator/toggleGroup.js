(function(d3, fc, sc) {
    'use strict';

    sc.menu.generator.toggleGroup = function() {
        var dispatch = d3.dispatch('toggleChange');

        function layoutButtons(sel) {
            sel.selectAll('label')
                .data(sel.datum())
                .enter()
                .append('label')
                .classed('btn btn-default', true)
                .text(function(d) { return d.displayString; })
                .append('input')
                .attr({
                    type: 'checkbox',
                    name: 'toggle',
                    value: function(d) { return d.valueString; }
                });
        }

        function toggleGenerator(selection) {
            selection.call(layoutButtons);

            selection.selectAll('.btn')
                .on('click', function() {
                    var toggledOption = d3.select(this)
                        .datum();
                    dispatch.toggleChange(toggledOption);
                });
        }

        d3.rebind(toggleGenerator, dispatch, 'on');

        return toggleGenerator;
    };

})(d3, fc, sc);