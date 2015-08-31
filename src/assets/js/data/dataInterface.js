(function(d3, fc, sc) {
    'use strict';

    sc.data.dataInterface = function() {
        var historicFeed = fc.data.feed.coinbase();
        var callbackGenerator = sc.util.callbackInvalidator();
        var ohlcConverter = sc.data.feed.coinbase.ohlcWebSocketAdaptor();
        var currentData = [];
        var dispatch = d3.dispatch('messageReceived', 'historicDataLoaded');

        function dataInterface(period) {
            callbackGenerator.invalidateCallback();
            ohlcConverter.close();
            historicFeed.granularity(period);
            ohlcConverter.period(period);
            updateHistoricFeedDateRangeToPresent(period);
            historicFeed(callbackGenerator(function(err, data) {
                if (!err) {
                    currentData = data.reverse();
                    ohlcConverter(liveCallback, currentData[currentData.length - 1]);
                }
                dispatch.historicDataLoaded(err, currentData);
            }));
        }

        dataInterface.invalidate = function() {
            ohlcConverter.close();
            callbackGenerator.invalidateCallback();
            return dataInterface;
        };

        d3.rebind(dataInterface, dispatch, 'on');

        function updateHistoricFeedDateRangeToPresent(period) {
            var currDate = new Date();
            var startDate = d3.time.second.offset(currDate, -200 * period);
            historicFeed.start(startDate)
                .end(currDate);
        }

        function liveCallback(socketEvent, latestBasket) {
            if (socketEvent.type === 'message' && latestBasket) {
                newBasketReceived(latestBasket);
            }
            dispatch.messageReceived(socketEvent, currentData);
        }

        function newBasketReceived(basket) {
            if (currentData[currentData.length - 1].date.getTime() !== basket.date.getTime()) {
                currentData.push(basket);
            } else {
                currentData[currentData.length - 1] = basket;
            }
        }

        return dataInterface;
    };

})(d3, fc, sc);