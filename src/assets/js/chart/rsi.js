(function(d3, fc, sc) {
    'use strict';

    sc.chart.rsi = function() {
        var dispatch = d3.dispatch(sc.event.viewChange);
        var renderer = fc.indicator.renderer.relativeStrengthIndex();
        var algorithm = fc.indicator.algorithm.relativeStrengthIndex();
        var tickValues = [renderer.lowerValue(), 50, renderer.upperValue()];

        var chart = sc.chart.secondary()
            .series([renderer])
            .yTickValues(tickValues)
            .on(sc.event.viewChange, function(domain) {
                dispatch[sc.event.viewChange](domain);
            });

        function rsi(selection) {
            var model = selection.datum();
            algorithm(model.data);

            chart.trackingLatest(model.trackingLatest)
                .xDomain(model.viewDomain)
                .yDomain([0, 100]);

            selection.datum(model.data)
                .call(chart);
        }

        d3.rebind(rsi, dispatch, 'on');

        return rsi;
    };
})(d3, fc, sc);
