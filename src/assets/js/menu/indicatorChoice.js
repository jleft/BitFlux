(function(d3, fc) {
    'use strict';

    sc.menu.indicatorChoice = function() {
        var dispatch = d3.dispatch('indicatorSelect');

        function indicatorButtons(sel) {
            sel.selectAll('label')
                .data(sel.datum())
                .enter()
                .append('label')
                .classed('btn btn-default', true)
                .classed('checked', false)
                .text(function(d, i) {return d.displayString; })
                .insert('input')
                .property('checked', false)
                .attr({
                    type: 'checkbox',
                    name: 'indicatorType',
                    id: function(d) {
                        return d.valueString;
                    },
                    value: function(d, i) { return d.valueString; }
                });
        }

        function indicatorChoice(selection) {
            selection.call(indicatorButtons);

            selection.selectAll('.btn')
                .on('click', function() {
                    var element = d3.select(this);
                    setTimeout(function() {
                        var selectedIndicator;
                        var checked = element.select('input')
                            .property('checked');
                        selectedIndicator = element
                            .datum();
                        selectedIndicator.show = checked;
                        dispatch.indicatorSelect(selectedIndicator);
                    }, 0);

                });
        }

        d3.rebind(indicatorChoice, dispatch, 'on');

        return indicatorChoice;
    };

})(d3, fc);