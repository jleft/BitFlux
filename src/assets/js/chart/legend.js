(function(d3, fc, sc) {
    'use strict';

    sc.chart.legend = function() {
        var formatPrice = function(x) { return sc.model.selectedProduct.priceFormat(x); };
        var formatVolume = function(x) { return sc.model.selectedProduct.volumeFormat(x); };
        var formatTime = function(x) { return sc.model.selectedPeriod.timeFormat(x); };

        var legendComponent = fc.chart.legend()
            .items([
                ['date', function(d) { return formatTime(d.date); }],
                ['open', function(d) { return formatPrice(d.open); }],
                ['high', function(d) { return formatPrice(d.high); }],
                ['low', function(d) { return formatPrice(d.low); }],
                ['close', function(d) { return formatPrice(d.close); }],
                ['volume', function(d) { return formatVolume(d.volume); }]
            ]);

        function legend(selection) {
            if (!selection.datum()) {
                selection.datum(sc.model.latestDataPoint);
            }
            selection.call(legendComponent);
        }

        return legend;
    };
})(d3, fc, sc);
