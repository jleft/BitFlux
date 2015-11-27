import d3 from 'd3';
import fc from 'd3fc';

export default function() {
    var dispatch = d3.dispatch('optionChange');
    var dataJoin = fc.util.dataJoin()
      .selector('.button')
      .element('label')
      .attr('class', 'button');

    function buttonGroup(selection) {
        selection.each(function(model) {
            var container = d3.select(this);

            dataJoin(container, model.options)
              .classed('active', function(option) { return (option.isSelected); })
              .classed('btn btn-primary', true)
              .text(function(option) { return option.displayString; })
              .on('click', dispatch.optionChange);
        });
    }

    d3.rebind(buttonGroup, dispatch, 'on');
    return buttonGroup;
};
