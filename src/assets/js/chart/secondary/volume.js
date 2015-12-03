(function(d3, fc, sc) {
    'use strict';

    sc.chart.secondary.volume = function() {
        var dispatch = d3.dispatch(sc.event.viewChange);
        var volumeBar = fc.series.bar()
            .yValue(function(d) { return d.volume; });

        var chart = sc.chart.secondary.base()
            .series([volumeBar])
            .yTicks(4)
            .on(sc.event.viewChange, function(domain) {
                dispatch[sc.event.viewChange](domain);
            });

        function volume(selection) {
            selection.each(function(model) {
                var paddedYExtent = fc.util.extent()
                    .fields('volume')
                    .pad(0.08)(model.data);
                if (paddedYExtent[0] < 0) {
                    paddedYExtent[0] = 0;
                }
                chart.yTickFormat(model.product.volumeFormat)
                    .trackingLatest(model.trackingLatest)
                    .xDomain(model.viewDomain)
                    .yDomain(paddedYExtent);

                selection.datum(model.data)
                    .call(chart);
            });
        }

        d3.rebind(volume, dispatch, 'on');

        volume.dimensionChanged = function(container) {
            chart.dimensionChanged(container);
        };

        return volume;
    };
}(d3, fc, sc));
