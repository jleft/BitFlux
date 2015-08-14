(function(d3, fc) {
    'use strict';

    var IndicatorType = function(displayString, valueString, indicator) {
        this.displayString = displayString;
        this.valueString = valueString;
        this.indicator = indicator;
    };

    var movingAverage = fc.series.line()
        .decorate(function(select) {
            select.enter().classed('movingAverage', true);
        })
        .yValue(function(d) { return d.movingAverage; });

    var noIndicator = new IndicatorType('None', 'no-indicator', null);
    var movingAverageIndicator = new IndicatorType('Moving Average', 'movingAverage', movingAverage);
    var bollingerIndicator = new IndicatorType('Bollinger Bands', 'bollinger', fc.indicator.renderer.bollingerBands());

    var indicatorTypeArray = [noIndicator, movingAverageIndicator, bollingerIndicator];

    d3.select('#indicator-buttons')
        .selectAll('label')
        .data(indicatorTypeArray)
        .enter()
        .append('label')
        .classed('btn btn-default', true)
        .classed('active', function(d, i) { return (i === 0); })
        .text(function(d, i) { return d.displayString; })
        .insert('input')
        .attr({
            type: 'radio',
            name: 'options',
            value: function(d, i) { return d.valueString; }
        })
        .property('checked', function(d, i) { return (i === 0); });

    sc.menu.selectIndicator = function(indicatorTypeString) {
        for (var i = 0; i < indicatorTypeArray.length; i++) {
            if (indicatorTypeString === indicatorTypeArray[i].valueString) {
                return indicatorTypeArray[i].indicator;
            }
        }
        return null;
    };

})(d3, fc);