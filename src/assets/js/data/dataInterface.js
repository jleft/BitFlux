import d3 from 'd3';
import fc from 'd3fc';
import callbackInvalidator from './callbackInvalidator';
import collectOhlc from './collectOhlc';
import webSocket from './coinbase/webSocket';
import event from '../event';

export default function() {
    var historicFeed = fc.data.feed.coinbase();
    var callbackGenerator = callbackInvalidator();
    var dataGenerator = fc.data.random.financial();
    var coinbaseWebSocket = webSocket();
    var collectOhlc = collectOhlc()
      .date(function(d) {return new Date(d.time);})
      .volume(function(d) {return Number(d.size);});
    var dispatch = d3.dispatch(event.newTrade, event.dataLoaded,
      event.dataLoadError, event.webSocketError);
    var candlesOfData = 200;
    var data = [];

    // TODO: configurable product.

    function updateHistoricFeedDateRangeToPresent(granularity) {
        var currDate = new Date();
        var startDate = d3.time.second.offset(currDate, -candlesOfData * granularity);
        historicFeed
          .start(startDate)
          .end(currDate);
    }

    function dataInterface(granularity) {
        invalidate();
        historicFeed.granularity(granularity);
        updateHistoricFeedDateRangeToPresent(granularity);
        collectOhlc.granularity(granularity);

        historicFeed(callbackGenerator(function(error, newData) {
            if (!error) {
                data = newData;
                dispatch[event.dataLoaded](dateSort(data));
            } else {
                dispatch[event.dataLoadError](error);
            }
        }));
        coinbaseWebSocket.on('message', function(trade) {
            collectOhlc(data, trade);
            dispatch[event.newTrade](data);
        });
        coinbaseWebSocket.on('error', function(error) {
            // TODO: The 'close' event is potentially more useful for error info.
            dispatch[event.webSocketError](error);
        });
        coinbaseWebSocket();
    }

    // TODO: remove? - #407
    dataInterface.generateDailyData = function() {
        invalidate();

        var now = new Date();
        now.setHours(0, 0, 0, 0);
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        dataGenerator.startDate(new Date(now - (candlesOfData - 1) * millisecondsPerDay));

        var generatedData = dataGenerator(candlesOfData);
        dispatch[event.dataLoaded](generatedData);
    };

    function invalidate() {
        coinbaseWebSocket.close();
        data = [];
        callbackGenerator.invalidateCallback();
    }

    function dateSort(dataToSort) {
        return dataToSort.sort(function(a, b) {
            return a.date - b.date;
        });
    }

    d3.rebind(dataInterface, dispatch, 'on');

    return dataInterface;
};
