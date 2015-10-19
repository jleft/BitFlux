(function(d3, fc, sc) {
    'use strict';

    sc.model.primaryChart = function() {
        return {
            data: [],
            trackingLatest: true,
            viewDomain: [],
            series: sc.menu.option('Candlestick', 'candlestick', sc.series.candlestick()),
            yValueAccessor: {option: function(d) { return d.close; }},
            indicators: [],
            toggleIndicator: function(indicator) {
                if (indicator) {
                    if (this.indicators.indexOf(indicator.option) !== -1 && !indicator.toggled) {
                        this.indicators.splice(this.indicators.indexOf(indicator.option), 1);
                    } else if (indicator.toggled) {
                        this.indicators.push(indicator.option);
                    }
                }
            }
        };
    };

})(d3, fc, sc);
