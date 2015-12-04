(function(d3, fc, sc) {
    'use strict';

    sc.event = {
        crosshairChange: 'crosshairChange',
        viewChange: 'viewChange',
        newTrade: 'newTrade',
        dataLoaded: 'dataLoaded',
        dataLoadError: 'dataLoadError',
        webSocketError: 'webSocketError',
        dataProductChange: 'dataProductChange',
        dataPeriodChange: 'dataPeriodChange',
        resetToLatest: 'resetToLatest',
        primaryChartSeriesChange: 'primaryChartSeriesChange',
        primaryChartYValueAccessorChange: 'primaryChartYValueAccessorChange',
        primaryChartIndicatorChange: 'primaryChartIndicatorChange',
        secondaryChartChange: 'secondaryChartChange'
    };

}(d3, fc, sc));
