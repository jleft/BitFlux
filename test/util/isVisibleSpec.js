import d3 from 'd3';
import isVisible from '../../src/assets/js/util/isVisible';

describe('util/isVisible', function() {

    var element;
    var container;

    beforeEach(function() {
        element = document.createElement('svg');
        document.body.appendChild(element);
        container = d3.select(element);
    });

    it('1', function() {
        expect(isVisible(container)).toBe(true);
    });

});
