import d3 from 'd3';
import fc from 'd3fc';
import callbackInvalidator from './callbackInvalidator';
import collectOhlc from './collectOhlc';
import coinbaseAdaptor from './adaptor/coinbase';
import dataGeneratorAdaptor from './adaptor/dataGenerator';
import webSocket from './coinbase/webSocket';
import event from '../event';

export default function() {
    var dispatch = d3.dispatch(
        event.historicDataLoaded,
        event.historicFeedError,
        event.newTrade,
        event.streamingFeedError);

    var _collectOhlc = collectOhlc()
        .date(function(d) {return new Date(d.time); })
        .volume(function(d) {return Number(d.size); });

    var historicFeed,
        streamingFeed,
        callbackGenerator = callbackInvalidator(),
        candlesOfData = 200,
        data = [];

    function invalidate() {
        if (streamingFeed) {
            streamingFeed.close();
        }
        data = [];
        callbackGenerator.invalidateCallback();
    }

    function dateSortAscending(dataToSort) {
        return dataToSort.sort(function(a, b) {
            return a.date - b.date;
        });
    }

    function dataInterface(granularity, product) {
        invalidate();

        if (arguments.length === 2) {
            historicFeed = product.source.historic;
            historicFeed.product(product.id);

            streamingFeed = product.source.streaming;
            if (streamingFeed != null) {
                streamingFeed.product(product.id);
            }
        }

        var now = new Date();

        historicFeed.end(now)
            .candles(candlesOfData)
            .granularity(granularity);

        _collectOhlc.granularity(granularity);

        historicFeed(callbackGenerator(function(error, newData) {
            if (!error) {
                data = dateSortAscending(newData);
                dispatch[event.historicDataLoaded](data);
            } else {
                dispatch[event.historicFeedError](error);
            }
        }));

        if (streamingFeed != null) {
            streamingFeed.on('message', function(trade) {
                _collectOhlc(data, trade);
                dispatch[event.newTrade](data);
            })
            .on('error', function(error) {
                // TODO: The 'close' event is potentially more useful for error info.
                dispatch[event.streamingFeedError](error);
            });
            streamingFeed();
        }
    }

    d3.rebind(dataInterface, dispatch, 'on');

    return dataInterface;
}
