import d3 from 'd3';
export default function(config) {
    return {
        display: config.display || 'Unspecified Product',
        priceFormat: d3.format(config.priceFormat || '.2f'),
        volumeFormat: d3.format(config.volumeFormat || 's'),
        periods: config.periods || []
    };
}
