import d3 from 'd3';
import event from '../event';
import buttonGroup from './generator/buttonGroup';

export default function() {

    var dispatch = d3.dispatch(
      event.primaryChartSeriesChange,
      event.primaryChartYValueAccessorChange,
      event.primaryChartIndicatorChange,
      event.secondaryChartChange);

    var primaryChartSeriesButtons = buttonGroup()
      .on('optionChange', dispatch[event.primaryChartSeriesChange]);

    var primaryChartYValueAccessorButtons = buttonGroup()
      .on('optionChange', dispatch[event.primaryChartYValueAccessorChange]);

    var primaryChartIndicatorToggle = buttonGroup()
      .on('optionChange', dispatch[event.primaryChartIndicatorChange]);

    var secondaryChartToggle = buttonGroup()
      .on('optionChange', dispatch[event.secondaryChartChange]);

    var side = function(selection) {
        selection.each(function(model) {
            var container = d3.select(this);

            container.select('.series-buttons')
              .datum({options: model.seriesOptions})
              .call(primaryChartSeriesButtons);

            container.select('.y-value-accessor-buttons')
              .datum({options: model.yValueAccessorOptions})
              .call(primaryChartYValueAccessorButtons);

            container.select('.indicator-buttons')
              .datum({options: model.indicatorOptions})
              .call(primaryChartIndicatorToggle);

            container.select('.secondary-chart-buttons')
              .datum({options: model.secondaryChartOptions})
              .call(secondaryChartToggle);
        });
    };

    return d3.rebind(side, dispatch, 'on');
};
