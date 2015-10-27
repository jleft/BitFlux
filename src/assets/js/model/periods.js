(function(d3, fc, sc) {
    'use strict';
    /**
    * @param {Object} config - object providing parameters.
    * config.display: sets the display string for the period.
    * config.seconds: sets the duration in seconds for each interval in this period.
    * config.d3TimeInterval: describe the time interval that d3 will use as the minimum space between 2 ticks.
    * config.timeFormat: sets the format string for time values with this period.
    * NB: each parameter is optional, but the default value are not necessarily useful.
    */
    function periodFactory(config) {
        config = config || {};
        return {
            display: config.display || '1 day',
            seconds: config.seconds || 60 * 60 * 24,
            d3TimeInterval: config.d3TimeInterval || {unit: d3.time.day, value: 1},
            timeFormat: d3.time.format(config.timeFormat || '%b %d')
        };
    }

    sc.model.periods = [];

    sc.model.period.day1 = periodFactory({
        display: '1 Day',
        seconds: 86400,
        d3TimeInterval: {unit: d3.time.day, value: 1},
        timeFormat: '%b-%d'});
    sc.model.period.hour1 = periodFactory({
        display: '1 Hour',
        seconds: 3600,
        d3TimeInterval: {unit: d3.time.hour, value: 1},
        timeFormat: '%b-%d %Hh'});
    sc.model.period.minute5 = periodFactory({
        display: '5 Minutes',
        seconds: 300,
        d3TimeInterval: {unit: d3.time.minute, value: 5},
        timeFormat: '%H:%M'});
    sc.model.period.minute1 = periodFactory({
        display: '1 Minute',
        seconds: 60,
        d3TimeInterval: {unit: d3.time.minute, value: 1},
        timeFormat: '%H:%M'});

    sc.model.periods.push(sc.model.period.day1);
    sc.model.periods.push(sc.model.period.hour1);
    sc.model.periods.push(sc.model.period.minute5);
    sc.model.periods.push(sc.model.period.minute1);
})(d3, fc, sc);
