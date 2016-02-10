import d3 from 'd3';
import fc from 'd3fc';

export default function() {
    function legend(selection) {
        selection.each(function(model) {
            var container = d3.select(this);

            var priceFormat = model.product.priceFormat;
            var volumeFormat = model.product.volumeFormat;
            var timeFormat = model.period.timeFormat;

            container.classed('hidden', !model.data);

            container.select('#tooltip')
                .layout({flexDirection: 'row'})
                .selectAll('.tooltip')
                .layout({marginRight: 40, marginLeft: 15});

            if (model.data) {
                var tooltip = fc.chart.tooltip()
                    .items([
                        ['T', function(d) { return timeFormat(d.date); }],
                        ['O', function(d) { return priceFormat(d.open); }],
                        ['H', function(d) { return priceFormat(d.high); }],
                        ['L', function(d) { return priceFormat(d.low); }],
                        ['C', function(d) { return priceFormat(d.close); }],
                        ['V', function(d) { return volumeFormat(d.volume); }]
                    ]);

                container.select('#tooltip')
                    .datum(model.data)
                    .call(tooltip);
            }
        });
    }

    return legend;
}
