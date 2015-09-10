(function(d3, fc, sc) {
    'use strict';

    sc.menu.head = function() {

        var dispatch = d3.dispatch('resetToLive',
            'toggleSlideout',
            'dataTypeChange',
            'periodChange');

        function setPeriodChangeVisibility(visible) {
            var visibility = visible ? 'visible' : 'hidden';
            d3.select('#period-selection')
                .style('visibility', visibility);
        }

        setPeriodChangeVisibility(false);

        var dataTypeChangeOptions = function(selection) {
            selection.on('change', function() {
                if (this.value === 'bitcoin') {
                    setPeriodChangeVisibility(true);
                } else {
                    setPeriodChangeVisibility(false);
                }
                dispatch.dataTypeChange(this.value);
            });
        };

        var periodChangeOptions = function(selection) {
            selection.on('change', function() {
                dispatch.periodChange(this.value);
            });
        };

        var head = function(selection) {
            selection.each(function() {
                var selection = d3.select(this);
                selection.select('#type-selection')
                    .call(dataTypeChangeOptions);
                selection.select('#period-selection')
                    .call(periodChangeOptions);
                selection.select('#reset-button')
                    .on('click', function() {
                        dispatch.resetToLive();
                    });
                selection.select('#toggle-button')
                    .on('click', function() {
                        dispatch.toggleSlideout();
                    });
            });
        };

        return d3.rebind(head, dispatch, 'on');
    };
})(d3, fc, sc);