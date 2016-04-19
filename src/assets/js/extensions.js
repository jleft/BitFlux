import d3 from 'd3';
import util from './util/util';

d3.selection.prototype.callIfVisible = function(callback) {
    if (util.isVisible(this)) {
        this.call(callback);
    }
};
