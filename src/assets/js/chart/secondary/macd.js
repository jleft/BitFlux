(function(d3, fc, sc) {
    'use strict';

    sc.chart.secondary.macd = function() {
        var dispatch = d3.dispatch(sc.event.viewChange);
        var zeroLine = fc.annotation.line()
            .value(0)
            .label('');
        var renderer = fc.indicator.renderer.macd();
        var algorithm = fc.indicator.algorithm.macd();

        var chart = sc.chart.secondary.base()
            .series([zeroLine, renderer])
            .yTicks(5)
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

            var paddedYExtent = fc.util.extent()
                .fields('macd')
                .symmetricalAbout(0)
                .pad(0.08)(model.data.map(function(d) { return d.macd; }));
            chart.trackingLatest(model.trackingLatest)
                .xDomain(model.viewDomain)
                .yDomain(paddedYExtent);

            selection.datum(model.data)
                .call(chart);
        }

        d3.rebind(macd, dispatch, 'on');

        macd.dimensionChanged = function(container) {
            chart.dimensionChanged(container);
        };

        return macd;
    };
}(d3, fc, sc));
