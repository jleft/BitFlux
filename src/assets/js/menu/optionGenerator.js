(function(d3, fc) {
    'use strict';

    function layoutButtons(sel) {
        sel.selectAll('label')
            .data(sel.datum())
            .enter()
            .append('label')
            .classed('btn btn-default', true)
            .classed('active', function(d, i) { return (i === 0); })
            .text(function(d, i) { return d.displayString; })
            .insert('input')
            .attr({
                type: 'radio',
                name: 'options',
                value: function(d, i) { return d.valueString; }
            })
            .property('checked', function(d, i) { return (i === 0); });
    }

    sc.menu.optionGenerator = function() {
        var dispatch = d3.dispatch('optionChange');

        function optionGenerator(selection) {
            selection.call(layoutButtons);

            selection.selectAll('.btn')
                .on('click', function() {
                    var selectedOption = d3.select(this)
                        .datum();
                    dispatch.optionChange(selectedOption);
                });
        }

        d3.rebind(optionGenerator, dispatch, 'on');

        return optionGenerator;
    };

})(d3, fc);