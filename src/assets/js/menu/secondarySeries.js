(function(d3, fc, sc) {
    'use strict';
    // Define secondary series types
    var SecondaryChartType = function(displayString, valueString, chart) {
        this.displayString = displayString;
        this.valueString = valueString;
        this.chart = chart;
    };

    var noChart = new SecondaryChartType('None', 'no-chart', null);
    var rsiChart = new SecondaryChartType('RSI', 'rsi', sc.chart.rsiChart());

    sc.menu.secondarySeries = function() {
        return [noChart, rsiChart];
    };
})(d3, fc, sc);