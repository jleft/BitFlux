(function(d3, fc, sc) {
    'use strict';

    sc.chart.macd = function() {
        var dispatch = d3.dispatch(sc.event.viewChange);
        var zeroLine = fc.annotation.line()
            .value(0)
            .label('');
        var renderer = fc.indicator.renderer.macd();
        var algorithm = fc.indicator.algorithm.macd();

        var chart = sc.chart.secondary()
            .series([zeroLine, renderer])
            .mapping(function(series) {
                return series === zeroLine ? [0] : this;
            })
            .decorate(function(g) {
                g.enter()
                    .attr('class', function(d, i) {
                        return ['multi zero', 'multi'][i];
                    });
            })
            .on(sc.event.viewChange, function(domain) {
                dispatch[sc.event.viewChange](domain);
            });

        function macd(selection) {
            var model = selection.datum();
            algorithm(model.data);

            var maxYExtent = d3.max(model.data, function(d) { return Math.abs(d.macd.macd); });
            var paddedYExtent = sc.util.domain.padYDomain([-maxYExtent, maxYExtent], 0.04);
            chart.trackingLatest(model.trackingLatest)
                .xDomain(model.viewDomain)
                .yDomain(paddedYExtent);

            selection.datum(model.data)
                .call(chart);
        }

        d3.rebind(macd, dispatch, 'on');

        return macd;
    };
})(d3, fc, sc);
