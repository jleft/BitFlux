(function(d3, fc, sc) {
    'use strict';

    describe('sc.util.returnDomainShiftedToEndOfData', function() {

        beforeEach(function() {});

        function obj(val) {
            return {
                date: new Date(val)
            };
        }

        it('should keep the extent size the same', function() {
            var extent = [new Date(1000), new Date(6000)];
            var data = [obj(1000), obj(10000)];
            var newExtent = sc.util.returnDomainShiftedToEndOfData(extent, data);
            var newExtentSize = newExtent[1].getTime() - newExtent[0].getTime();
            expect(newExtentSize).toBe(5000);
        });

        it('should move the extent to have its end at the last point of data', function() {
            var extent = [new Date(1000), new Date(6000)];
            var data = [obj(1000), obj(10000)];
            var newExtent = sc.util.returnDomainShiftedToEndOfData(extent, data);
            expect(newExtent[1].getTime()).toBe(data[1].date.getTime());
        });

    });
})(d3, fc, sc);