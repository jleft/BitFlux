(function(sc) {
    'use strict';
    sc.data.feed.coinbase.ohlcWebSocketAdaptor = function() {
        // Expects transactions with a price, volume and date and organizes them into candles of given periods
        // Re-call OHLC whenever you want to start collecting for a new period/product
        // In seconds
        var period = 60 * 60 * 24;
        var liveFeed = sc.data.feed.coinbase.webSocket();

        function ohlcWebSocketAdaptor(cb, initialBasket) {
            var basket = initialBasket;
            liveFeed(function(err, datum) {
                if (datum) {
                    basket = updateBasket(basket, datum);
                }
                cb(err, basket);
            });
        }

        ohlcWebSocketAdaptor.period = function(x) {
            if (!arguments.length) {
                return period;
            }
            period = x;
            return ohlcWebSocketAdaptor;
        };

        d3.rebind(ohlcWebSocketAdaptor, liveFeed, 'product', 'messageType', 'close');

        function updateBasket(basket, datum) {
            if (basket == null) {
                basket = createNewBasket(datum, datum.date);
            }
            var latestTime = datum.date.getTime();
            var startTime = basket.date.getTime();
            var msPeriod = period * 1000;
            if (latestTime > startTime + msPeriod) {
                var timeIntoCurrentPeriod = (latestTime - startTime) % msPeriod;
                var newTime = latestTime - timeIntoCurrentPeriod;
                basket = createNewBasket(datum, new Date(newTime));
            } else {
                // Update current basket
                basket.high = Math.max(basket.high, datum.price);
                basket.low = Math.min(basket.low, datum.price);
                basket.volume += datum.volume;
                basket.close = datum.price;
            }
            return basket;
        }

        function createNewBasket(datum, time) {
            return {
                date: time,
                open: datum.price,
                close: datum.price,
                low: datum.price,
                high: datum.price,
                volume: datum.volume
            };
        }

        return ohlcWebSocketAdaptor;
    };
})(sc);
