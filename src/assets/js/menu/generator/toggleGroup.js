(function(d3, fc, sc) {
    'use strict';

    sc.menu.generator.toggleGroup = function() {
        var dispatch = d3.dispatch('toggleChange');

        var dataJoin = fc.util.dataJoin()
            .selector('label.btn btn-default')
            .element('label')
            .attr('class', 'btn btn-default');

        function layoutButtons(sel) {
            dataJoin(sel, sel.datum())
                .text(function(d) { return d.displayString; })
                .insert('input')
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
                    var self = d3.select(this);
                    setTimeout(function() {
                        var toggledOption = {
                            option: self.datum(),
                            toggled: self.select('input').property('checked')
                        };
                        dispatch.toggleChange(toggledOption);
                    }, 0);
                });
        }

        d3.rebind(toggleGenerator, dispatch, 'on');

        return toggleGenerator;
    };
})(d3, fc, sc);