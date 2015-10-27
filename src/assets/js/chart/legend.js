(function(d3, fc, sc) {
    'use strict';

    sc.chart.legend = function() {
        var formatPrice;
        var formatVolume;
        var formatTime;
        var lastDataPointDisplayed;

        var legendComponent = fc.chart.legend().items([
                ['date', function(d) { return formatTime(d.date); }],
                ['open', function(d) { return formatPrice(d.open); }],
                ['high', function(d) { return formatPrice(d.high); }],
                ['low', function(d) { return formatPrice(d.low); }],
                ['close', function(d) { return formatPrice(d.close); }],
                ['volume', function(d) { return formatVolume(d.volume); }]
            ]);

        function legend(selection) {
            selection.each(function(model) {
                var container = d3.select(this);

                formatPrice = model.product.priceFormat;
                formatVolume = model.product.volumeFormat;
                formatTime = model.period.timeFormat;

                if (model.data !== lastDataPointDisplayed) {
                    lastDataPointDisplayed = model.data;
                    container.datum(model.data)
                        .call(legendComponent);
                }
            });
        }

        return legend;
    };
})(d3, fc, sc);
