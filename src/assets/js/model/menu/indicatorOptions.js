import fc from 'd3fc';
import option from './option';
import util from '../../util/util';

var movingAverage = fc.series.line()
  .decorate(function(select) {
      select.enter()
        .classed('movingAverage', true);
  })
  .yValue(function(d) { return d.movingAverage; });
movingAverage.id = util.uid();

var bollingerBands = fc.indicator.renderer.bollingerBands();
bollingerBands.id = util.uid();

export default [
    option('Moving Average', 'movingAverage',
      movingAverage, 'sc-icon-moving-average-indicator'),
    option('Bollinger Bands', 'bollinger',
      bollingerBands, 'sc-icon-bollinger-bands-indicator')
];
