(function(d3, fc, sc) {
    'use strict';

    sc.model.menu.yValueAccessorOptions = function() {

        var closeOption = sc.model.menu.option('Close', 'close', function(d) { return d.close; });
        closeOption.isSelected = true;

        return [
            sc.model.menu.option('Open', 'open', function(d) { return d.open; }),
            sc.model.menu.option('High', 'high', function(d) { return d.high; }),
            sc.model.menu.option('Low', 'low', function(d) { return d.low; }),
            closeOption
        ];
    };

}(d3, fc, sc));
