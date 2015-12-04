(function(d3, fc, sc) {
    'use strict';

    sc.menu.navigationReset = function() {

        var dispatch = d3.dispatch(sc.event.resetToLatest);

        function navReset(selection) {
            var model = selection.datum();

            var resetButton = selection.selectAll('g')
                .data([model]);

            resetButton.enter()
                .append('g')
                .attr('class', 'reset-button')
                .on('click', function() { dispatch[sc.event.resetToLatest](); })
                .append('path')
                .attr('d', 'M1.5 1.5h13.438L23 20.218 14.937 38H1.5l9.406-17.782L1.5 1.5z');

            resetButton.classed('active', !model.trackingLatest);
        }

        d3.rebind(navReset, dispatch, 'on');

        return navReset;
    };
}(d3, fc, sc));
