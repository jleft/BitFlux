import d3 from 'd3';
import fc from 'd3fc';
import debounce from '../../../util/debounce';

export default function() {
    var rateLimit = 1000;       // The coinbase API has a limit of 1 request per second

    var historicFeed = fc.data.feed.coinbase(),
        candles;

    var coinbaseAdaptor = debounce(function coinbaseAdaptor(cb) {
        var startDate = d3.time.second.offset(historicFeed.end(), -candles * historicFeed.granularity());
        historicFeed.start(startDate);
        historicFeed(cb);
    }, rateLimit);

    coinbaseAdaptor.candles = function(x) {
        if (!arguments.length) {
            return candles;
        }
        candles = x;
        return coinbaseAdaptor;
    };

    coinbaseAdaptor.apiKey = function() {
        throw new Error('Not implemented.');
    };

    coinbaseAdaptor.database = function() {
        throw new Error('Not implemented.');
    };

    coinbaseAdaptor.columnNameMap = function() {
        throw new Error('Not implemented.');
    };

    d3.rebind(coinbaseAdaptor, historicFeed, 'end', 'granularity', 'product');

    return coinbaseAdaptor;
}
