(function(sc) {
    'use strict';
    sc.data.feed.coinbase.webSocket = function() {
        var product = 'BTC-USD';
        var msgType = 'match';
        var coinbaseSocket = null;

        function webSocket(cb) {
            webSocket.close();
            coinbaseSocket = new WebSocket('wss://ws-feed.exchange.coinbase.com');
            var msg = {
                type: 'subscribe',
                'product_id': product
            };

            coinbaseSocket.onopen = function(event) {
                coinbaseSocket.send(JSON.stringify(msg));
                cb(event, null);
            };

            coinbaseSocket.onmessage = function(event) {
                var messageData = JSON.parse(event.data);
                if (messageData.type === msgType) {
                    var datum = {};
                    datum.date = new Date(messageData.time);
                    datum.price = parseFloat(messageData.price);
                    datum.volume = parseFloat(messageData.size);
                    cb(event, datum);
                }
            };

            coinbaseSocket.onerror = function(event) {
                cb(event, null);
            };

            coinbaseSocket.onclose = function(event) {
                cb(event, null);
            };

        }

        webSocket.close = function() {
            if (coinbaseSocket) {
                coinbaseSocket.close();
            }
            return webSocket;
        };

        webSocket.messageType = function(x) {
            if (!arguments.length) {
                return msgType;
            }
            msgType = x;
            return webSocket;
        };

        webSocket.product = function(x) {
            if (!arguments.length) {
                return product;
            }
            product = x;
            return webSocket;
        };

        return webSocket;
    };

})(sc);
