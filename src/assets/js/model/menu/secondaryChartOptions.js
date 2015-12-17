import secondary from '../../chart/secondary/secondary';
import option from './option';

export default [
    option(
        'Relative Strength Index',
        'secondary-rsi',
        secondary.rsi(),
        'sc-icon-rsi-indicator'),
    option(
        'MACD',
        'secondary-macd',
        secondary.macd(),
        'sc-icon-macd-indicator'),
    option(
        'Volume',
        'secondary-volume',
        secondary.volume(),
        'sc-icon-bar-series')
];
