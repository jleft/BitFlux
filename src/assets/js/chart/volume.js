(function(d3, fc, sc) {
    'use strict';

    sc.chart.volume = function() {
        var dispatch = d3.dispatch(sc.event.viewChange);
        var formatVolume = function(volume) { return sc.model.selectedProduct.volumeFormat(volume); };
        var volumeBar = fc.series.bar()
            .yValue(function(d) { return d.volume; });

        var chart = sc.chart.secondary()
            .series([volumeBar])
            .yTickFormat(formatVolume)
            .on(sc.event.viewChange, function(domain) {
                dispatch[sc.event.viewChange](domain);
            });

        function volume(selection) {
            var model = selection.datum();

            var maxYExtent = d3.max(model.data, function(d) { return d3.max([d.volume]); });
            var minYExtent = d3.min(model.data, function(d) { return d3.min([d.volume]); });
            var paddedYExtent = sc.util.domain.padYDomain([minYExtent, maxYExtent], 0.04);
            chart.trackingLatest(model.trackingLatest)
                .xDomain(model.viewDomain)
                .yDomain(paddedYExtent);

            selection.datum(model.data)
                .call(chart);
        }

        d3.rebind(volume, dispatch, 'on');

        return volume;
    };
})(d3, fc, sc);
