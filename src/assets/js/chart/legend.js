import d3 from 'd3';

export default function() {
    var formatPrice;
    var formatVolume;
    var formatTime;
    var lastDataPointDisplayed;

    var legendItems = [
        'T',
        function(d) { return formatTime(d.date); },
        'O',
        function(d) { return formatPrice(d.open); },
        'H',
        function(d) { return formatPrice(d.high); },
        'L',
        function(d) { return formatPrice(d.low); },
        'C',
        function(d) { return formatPrice(d.close); },
        'V',
        function(d) { return formatVolume(d.volume); }
    ];

    function legend(selection) {
        selection.each(function(model) {
            var container = d3.select(this);

            formatPrice = model.product.priceFormat;
            formatVolume = model.product.volumeFormat;
            formatTime = model.period.timeFormat;

            if (model.data == null || model.data !== lastDataPointDisplayed) {
                lastDataPointDisplayed = model.data;

                var span = container.selectAll('span')
                  .data(legendItems);

                span.enter()
                  .append('span')
                  .attr('class', function(d, i) { return i % 2 === 0 ? 'legendLabel' : 'legendValue'; });

                span.text(function(d, i) {
                    var text = '';
                    if (i % 2 === 0) {
                        return d;
                    } else if (model.data) {
                        return d(model.data);
                    }
                    return text;
                });
            }
        });
    }

    return legend;
};
