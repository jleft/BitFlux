(function(d3, fc, sc) {
    'use strict';

    sc.model.primaryChart = function(initialProduct) {
        var model = {
            data: [],
            trackingLatest: true,
            viewDomain: [],
            selectorsChanged: true
        };

        var _product = initialProduct;
        Object.defineProperty(model, 'product', {
            get: function() { return _product; },
            set: function(newValue) {
                _product = newValue;
                model.selectorsChanged = true;
            }
        });

        var candlestick =  sc.series.candlestick();
        candlestick.id = sc.util.uid();
        var _series = sc.menu.option('Candlestick', 'candlestick', candlestick);
        Object.defineProperty(model, 'series', {
            get: function() { return _series; },
            set: function(newValue) {
                _series = newValue;
                model.selectorsChanged = true;
            }
        });

        var _yValueAccessor = {option: function(d) { return d.close; }};
        Object.defineProperty(model, 'yValueAccessor', {
            get: function() { return _yValueAccessor; },
            set: function(newValue) {
                _yValueAccessor = newValue;
                model.selectorsChanged = true;
            }
        });

        var _indicators = [];
        Object.defineProperty(model, 'indicators', {
            get: function() { return _indicators; },
            set: function(newValue) {
                _indicators = newValue;
                model.selectorsChanged = true;
            }
        });


        return model;
    };

})(d3, fc, sc);
