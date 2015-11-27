import option from '../option';

var closeOption = option('Close', 'close', function(d) { return d.close; });
closeOption.isSelected = true;

export default [
    option('Open', 'open', function(d) { return d.open; }),
    option('High', 'high', function(d) { return d.high; }),
    option('Low', 'low', function(d) { return d.low; }),
    closeOption
];
