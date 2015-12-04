import d3 from 'd3';

export default function(config) {
    config = config || {};
    return {
        display: config.display || '1 day',
        seconds: config.seconds || 60 * 60 * 24,
        d3TimeInterval: config.d3TimeInterval || {unit: d3.time.day, value: 1},
        timeFormat: d3.time.format(config.timeFormat || '%b %d')
    };
}
