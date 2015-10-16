(function(d3, fc, sc) {
    'use strict';

    sc.data.dataInterface = function() {
        var historicFeed = fc.data.feed.coinbase();
        var callbackGenerator = sc.data.callbackInvalidator();
        var ohlcConverter = sc.data.feed.coinbase.ohlcWebSocketAdaptor();
        var dataGenerator = fc.data.random.financial();
        var dispatch = d3.dispatch('messageReceived', 'dataLoaded');
        var candlesOfData = 200;

        function updateHistoricFeedDateRangeToPresent(period) {
            var currDate = new Date();
            var startDate = d3.time.second.offset(currDate, -candlesOfData * period);
            historicFeed.start(startDate)
                .end(currDate);
        }

        function newBasketReceived(basket, data) {
            if (data[data.length - 1].date.getTime() !== basket.date.getTime()) {
                data.push(basket);
            } else {
                data[data.length - 1] = basket;
            }
        }

        function liveCallback(data) {
            return function(socketEvent, latestBasket) {
                if (socketEvent.type === 'message' && latestBasket) {
                    newBasketReceived(latestBasket, data);
                }
                dispatch.messageReceived(socketEvent, data);
            };
        }

        function dataInterface(period) {
            dataInterface.invalidate();
            historicFeed.granularity(period);
            ohlcConverter.period(period);
            updateHistoricFeedDateRangeToPresent(period);
            var currentData = [];
            historicFeed(callbackGenerator(function(err, data) {
                if (!err) {
                    currentData = data.reverse();
                    ohlcConverter(liveCallback(currentData), currentData[currentData.length - 1]);
                }
                dispatch.dataLoaded(err, currentData);
            }));
        }

        dataInterface.generateDailyData = function() {
            dataInterface.invalidate();

            var now = new Date();
            now.setHours(0, 0, 0, 0);
            var millisecondsPerDay = 24 * 60 * 60 * 1000;
            dataGenerator.startDate(new Date(now - (candlesOfData - 1) * millisecondsPerDay));

            var dataGenerated = dataGenerator(candlesOfData);
            dispatch.dataLoaded(null, dataGenerated);
        };

        dataInterface.invalidate = function() {
            ohlcConverter.close();
            callbackGenerator.invalidateCallback();
            return dataInterface;
        };

        d3.rebind(dataInterface, dispatch, 'on');

        return dataInterface;
    };
})(d3, fc, sc);
