(function(d3, fc, sc) {
    'use strict';

    sc.menu.generator.buttonGroup = function(defaultValue) {
        if (!arguments.length) {
            defaultValue = 0;
        }

        var dispatch = d3.dispatch('optionChange');

        var dataJoin = fc.util.dataJoin()
            .selector('label.btn btn-default')
            .element('label')
            .attr('class', 'btn btn-default');

        function layoutButtons(sel) {
            var activeValue = defaultValue < sel.datum().length ? defaultValue : 0;

            dataJoin(sel, sel.datum())
                .classed('active', function(d, i) { return (i === activeValue); })
                .text(function(d) { return d.displayString; })
                .insert('input')
                .attr({
                    type: 'radio',
                    name: 'options',
                    value: function(d) { return d.valueString; }
                })
                .property('checked', function(d, i) { return (i === activeValue); });
        }

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
})(d3, fc, sc);