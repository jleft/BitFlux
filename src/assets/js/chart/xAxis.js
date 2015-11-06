(function(d3, fc, sc) {
    'use strict';

    sc.chart.xAxis = function() {

        var xScale = fc.scale.dateTime();
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        function preventTicksMoreFrequentThanPeriod(period) {
            var scaleTickSeconds = (xScale.ticks()[1] - xScale.ticks()[0]) / 1000;
            if (scaleTickSeconds < period.seconds) {
                xAxis.ticks(period.d3TimeInterval.unit, period.d3TimeInterval.value);
            } else {
                xAxis.ticks(6);
            }
        }

        function xAxisChart(selection) {
            var model = selection.datum();
            xScale.domain(model.viewDomain)
                .range([0, model.width]);
            preventTicksMoreFrequentThanPeriod(model.period);
            selection.call(xAxis);
        }

        return xAxisChart;
    };
})(d3, fc, sc);
