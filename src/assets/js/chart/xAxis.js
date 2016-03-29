import d3 from 'd3';
import fc from 'd3fc';
import util from '../util/util';

export default function() {
    var xScale = fc.scale.dateTime();

    var xAxis = fc.svg.axis()
      .scale(xScale)
      .orient('bottom');

    function preventTicksMoreFrequentThanPeriod(period) {
        var scaleTickSeconds = (xScale.discontinuityProvider().distance(xScale.ticks()[0], xScale.ticks()[1])) / 1000;

        if (scaleTickSeconds < period.seconds) {
            xAxis.ticks(period.d3TimeInterval.unit, period.d3TimeInterval.value);
        } else {
            xAxis.ticks(6);
        }
    }

    function adaptTickFormatting() {
        var scaleTickSeconds = (xScale.discontinuityProvider().distance(xScale.ticks()[0], xScale.ticks()[1])) / 1000;

        var secondsInHour = 60 * 60;
        var secondsInWeek = secondsInHour * 24 * 7;

        var tickFormatting = d3.time.format.multi([
            ['%H:%M,%d %b', function() { return (scaleTickSeconds / secondsInHour) <= 0.5; }],
            ['%I %p,%a %d %b', function() { return (scaleTickSeconds / secondsInHour) <= 6; }],
            ['%a %d,%b %Y', function() { return (scaleTickSeconds / secondsInWeek) <= 1; }],
            ['%B,%Y', function() { return true; }]
        ]);

        xAxis.tickFormat(tickFormatting);
    }

    function xAxisChart(selection) {
        var model = selection.datum();

        xScale.domain(model.viewDomain);

        xScale.discontinuityProvider(model.discontinuityProvider);

        preventTicksMoreFrequentThanPeriod(model.period);
        adaptTickFormatting();

        xAxis.decorate(function() {
            var tickText = selection.selectAll('text');
            tickText.each(function() {
                var text = d3.select(this);
                var split = text.text().split(',');
                text.text(null);
                text.append('tspan')
                    .attr('class', 'axis-label-main')
                    .attr('x', 0)
                    .text(split[0]);
                text.append('tspan')
                    .attr('class', 'axis-label-secondary')
                    .attr('dy', '1em')
                    .attr('x', 0)
                    .text(split[1]);
            });
        });

        selection.call(xAxis);
    }

    xAxisChart.dimensionChanged = function(container) {
        xScale.range([0, util.width(container.node())]);
    };

    return xAxisChart;
}
