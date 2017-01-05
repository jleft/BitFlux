import d3 from 'd3';
import fc from 'd3fc';
import fcRebind from 'd3fc-rebind';
import Bottleneck from 'bottleneck';

export default function() {

    // Concurrent calls to the Quandl API are prohibited
    // https://blog.quandl.com/change-quandl-api-limits
    var maxConcurrentRequests = 1;
    var delayBetweenRequests = 50;
    var limiter = new Bottleneck(maxConcurrentRequests, delayBetweenRequests);

    var historicFeed = fc.data.feed.quandl()
            .database('WIKI')
            .columnNameMap(mapColumnNames),
        granularity,
        candles;

    // More options are allowed through the API; for now, only support daily and weekly
    var allowedPeriods = d3.map();
    allowedPeriods.set(60 * 60 * 24, 'daily');
    allowedPeriods.set(60 * 60 * 24 * 7, 'weekly');

    // Map fields for WIKI database, to use all adjusted values
    var columnNameMap = d3.map();
    columnNameMap.set('Open', 'unadjustedOpen');
    columnNameMap.set('High', 'unadjustedHigh');
    columnNameMap.set('Low', 'unadjustedLow');
    columnNameMap.set('Close', 'unadjustedClose');
    columnNameMap.set('Volume', 'unadjustedVolume');
    columnNameMap.set('Adj. Open', 'open');
    columnNameMap.set('Adj. High', 'high');
    columnNameMap.set('Adj. Low', 'low');
    columnNameMap.set('Adj. Close', 'close');
    columnNameMap.set('Adj. Volume', 'volume');

    function mapColumnNames(colName) {
        var mappedName = columnNameMap.get(colName);
        if (!mappedName) {
            mappedName = colName[0].toLowerCase() + colName.substr(1);
        }
        return mappedName;
    }

    function normaliseDataDateToStartOfDay(data) {
        return data.map(function(datum) {
            datum.date.setHours(0, 0, 0, 0);
            return datum;
        });
    }

    function quandlAdaptor(cb) {
        var startDate = d3.time.second.offset(historicFeed.end(), -candles * granularity);
        historicFeed.start(startDate)
            .collapse(allowedPeriods.get(granularity));
        limiter.submit(historicFeed, function(err, data) {
            if (err) {
                cb(err);
            } else {
                var normalisedData = normaliseDataDateToStartOfDay(data);
                cb(err, normalisedData);
            }
        });
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

    fcRebind.rebindAll(quandlAdaptor, historicFeed, fcRebind.includeMap({
        'end': 'end',
        'dataset': 'product',
        'apiKey': 'apiKey'
    }));

    return quandlAdaptor;
}
