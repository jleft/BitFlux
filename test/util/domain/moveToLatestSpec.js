(function(d3, fc, sc) {
    'use strict';

    describe('sc.util.domain.moveToLatest', function() {

        function obj(val) {
            return {
                date: new Date(val)
            };
        }

        it('should keep the extent size the same by default', function() {
            var extent = [new Date(1000), new Date(6000)];
            var data = [obj(1000), obj(10000)];
            var newExtent = sc.util.domain.moveToLatest(extent, data);
            var newExtentSize = newExtent[1].getTime() - newExtent[0].getTime();
            expect(newExtentSize).toBe(5000);
        });

        it('should move the extent to have its end at the last point of data', function() {
            var extent = [new Date(1000), new Date(6000)];
            var data = [obj(1000), obj(10000)];
            var newExtent = sc.util.domain.moveToLatest(extent, data);
            expect(newExtent[1].getTime()).toBe(data[1].date.getTime());
        });

        it('should scale the extent in proportion to the inputted value', function() {
            var extent = [new Date(1000), new Date(6000)];
            var data = [obj(1000), obj(10000)];
            var newExtent = sc.util.domain.moveToLatest(extent, data, 0.2);
            var newExtentSize = newExtent[1].getTime() - newExtent[0].getTime();
            expect(newExtentSize).toBe(1000);
        });

    });
})(d3, fc, sc);