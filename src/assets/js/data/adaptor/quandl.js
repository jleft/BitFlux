import d3 from 'd3';
import fc from 'd3fc';

export default function() {

    var historicFeed = fc.data.feed.quandl(),
        granularity,
        candles;

    // More options are allowed through the API; for now, only support daily and weekly
    var allowedPeriods = d3.map();
    allowedPeriods.set(60 * 60 * 24, 'daily');
    allowedPeriods.set(60 * 60 * 24 * 7, 'weekly');

    function quandlAdaptor(cb) {
        var startDate = d3.time.second.offset(historicFeed.end(), -candles * granularity);
        historicFeed.start(startDate)
            .collapse(allowedPeriods.get(granularity));
        historicFeed(cb);
    }

    quandlAdaptor.candles = function(x) {
        if (!arguments.length) {
            return candles;
        }
        candles = x;
        return quandlAdaptor;
    };

    quandlAdaptor.granularity = function(x) {
        if (!arguments.length) {
            return granularity;
        }
        if (!allowedPeriods.has(x)) {
            throw new Error('Granularity of ' + x + ' is not supported.');
        }
        granularity = x;
        return quandlAdaptor;
    };

    fc.util.rebind(quandlAdaptor, historicFeed, {
        end: 'end',
        product: 'dataset'
    });

    return quandlAdaptor;
}
