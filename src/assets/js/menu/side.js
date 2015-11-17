(function(d3, fc, sc) {
    'use strict';

    sc.menu.side = function() {

        var dispatch = d3.dispatch(
            sc.event.primaryChartSeriesChange,
            sc.event.primaryChartYValueAccessorChange,
            sc.event.primaryChartIndicatorChange,
            sc.event.secondaryChartChange);

        var primaryChartSeriesButtons = sc.menu.generator.buttonGroup()
            .on('optionChange', dispatch[sc.event.primaryChartSeriesChange]);

        var primaryChartYValueAccessorButtons = sc.menu.generator.buttonGroup()
            .on('optionChange', dispatch[sc.event.primaryChartYValueAccessorChange]);

        var primaryChartIndicatorToggle = sc.menu.generator.buttonGroup()
            .on('optionChange', dispatch[sc.event.primaryChartIndicatorChange]);

        var secondaryChartToggle = sc.menu.generator.buttonGroup()
            .on('optionChange', dispatch[sc.event.secondaryChartChange]);

        var side = function(selection) {
            selection.each(function(model) {
                var selection = d3.select(this);

                selection.select('.series-buttons')
                    .datum({options: model.seriesOptions})
                    .call(primaryChartSeriesButtons);

                selection.select('.y-value-accessor-buttons')
                    .datum({options: model.yValueAccessorOptions})
                    .call(primaryChartYValueAccessorButtons);

                selection.select('.indicator-buttons')
                    .datum({options: model.indicatorOptions})
                    .call(primaryChartIndicatorToggle);

                selection.select('.secondary-chart-buttons')
                    .datum({options: model.secondaryChartOptions})
                    .call(secondaryChartToggle);
            });
        };

        return d3.rebind(side, dispatch, 'on');
    };
})(d3, fc, sc);
