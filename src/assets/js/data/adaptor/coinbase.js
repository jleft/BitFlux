import d3 from 'd3';
import fc from 'd3fc';

export default function() {

    var historicFeed = fc.data.feed.coinbase(),
        candles;

    function coinbaseAdaptor(cb) {
        var startDate = d3.time.second.offset(historicFeed.end(), -candles * historicFeed.granularity());
        historicFeed.start(startDate);
        historicFeed(cb);
    }

    coinbaseAdaptor.candles = function(x) {
        if (!arguments.length) {
            return candles;
        }
        candles = x;
        return coinbaseAdaptor;
    };

    d3.rebind(coinbaseAdaptor, historicFeed, 'end', 'granularity', 'product');

    return coinbaseAdaptor;
}
