(function(d3, fc, sc) {
    'use strict';

    // Set SVGs & column padding
    var container = d3.select('#app-container');

    var svgMain = container.select('svg.primary');
    var svgRSI = container.select('svg.rsi');
    var svgNav = container.select('svg.nav');

    var dataModel = {
        data: fc.data.random.financial()(250),
        viewDomain: []
    };

    sc.util.calculateDimensions(container);

    var primaryChart = sc.chart.primaryChart();
    var rsiChart = sc.chart.rsiChart();
    var navChart = sc.chart.navChart();

    function onViewChanged(domain) {
        dataModel.viewDomain = [domain[0], domain[1]];
        render();
    }

    primaryChart.on('viewChange', onViewChanged);
    rsiChart.on('viewChange', onViewChanged);
    navChart.on('viewChange', onViewChanged);

    container.select('#series-buttons')
        .selectAll('.btn')
        .on('click', function() {
            var seriesTypeString = d3.select(this)
                .select('input')
                .node()
                .value;
            var selectedSeries = sc.menu.selectSeries(seriesTypeString);
            primaryChart.changeSeries(selectedSeries);
            render();
        });

    container.select('#indicator-buttons')
        .selectAll('.btn')
        .on('click', function() {
            var indicatorTypeString = d3.select(this)
                .select('input')
                .node()
                .value;
            var selectedIndicator = sc.menu.selectIndicator(indicatorTypeString);
            primaryChart.changeIndicator(selectedIndicator);
            render();
        });

    // Set Reset button event
    function resetToLive() {
        // Using golden ratio to make initial display area rectangle into the golden rectangle
        var goldenRatio = 1.618;
        var navAspect = parseInt(svgNav.style('height'), 10) / svgNav.attr('width');
        var data = dataModel.data;
        var standardDateDisplay = [data[Math.floor((1 - navAspect * goldenRatio) * data.length)].date,
            data[data.length - 1].date];
        onViewChanged(standardDateDisplay);
        render();
    }

    container.select('#reset-button').on('click', resetToLive);

    function render() {
        svgMain.datum(dataModel)
            .call(primaryChart);

        svgRSI.datum(dataModel)
            .call(rsiChart);

        svgNav.datum(dataModel)
            .call(navChart);
    }

    function resize() {
        sc.util.calculateDimensions(container);
        render();
    }

    d3.select(window).on('resize', resize);

    resetToLive();
    resize();

})(d3, fc, sc);
