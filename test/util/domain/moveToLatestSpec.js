(function(d3, fc, sc) {
    'use strict';

    describe('sc.util.domain.moveToLatest', function() {

        function obj(val) {
            return {
                date: new Date(val)
            };
        }

        var data;
        var reversedData;

        beforeEach(function() {
            data = [obj(1000), obj(10000)];
            reversedData = [data[1], data[0]];
        });

        it('should keep the extent size the same by default', function() {
            var extent = [new Date(1000), new Date(6000)];
            var reversedExtent = [extent[1], extent[0]];

            var moveToLatestExtent = sc.util.domain.moveToLatest(extent, data);

            expect(moveToLatestExtent.length).toEqual(extent.length);
            expect(moveToLatestExtent[0].getTime()).toEqual(5000);
            expect(moveToLatestExtent[1].getTime()).toEqual(10000);

            var reversedMoveToLatestExtent = sc.util.domain.moveToLatest(reversedExtent, reversedData);

            expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
            expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
            expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
        });

        it('should move the extent to end at the last data point if extent ends before the data', function() {
            var extent = [new Date(1000), new Date(6000)];
            var reversedExtent = [extent[1], extent[0]];

            var moveToLatestExtent = sc.util.domain.moveToLatest(extent, data);

            expect(moveToLatestExtent.length).toEqual(extent.length);
            expect(moveToLatestExtent[0].getTime()).toEqual(5000);
            expect(moveToLatestExtent[1].getTime()).toEqual(10000);

            var reversedMoveToLatestExtent = sc.util.domain.moveToLatest(reversedExtent, reversedData);

            expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
            expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
            expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
        });

        it('should move the extent to end at the last data point if extent ends after the data', function() {
            var extent = [new Date(11000), new Date(16000)];
            var reversedExtent = [extent[1], extent[0]];

            var moveToLatestExtent = sc.util.domain.moveToLatest(extent, data);

            expect(moveToLatestExtent.length).toEqual(extent.length);
            expect(moveToLatestExtent[0].getTime()).toEqual(5000);
            expect(moveToLatestExtent[1].getTime()).toEqual(10000);

            var reversedMoveToLatestExtent = sc.util.domain.moveToLatest(reversedExtent, reversedData);

            expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
            expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
            expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
        });

        it('should scale the extent in proportion to the inputted value', function() {
            var extent = [new Date(1000), new Date(6000)];
            var reversedExtent = [extent[1], extent[0]];

            var moveToLatestExtent = sc.util.domain.moveToLatest(extent, data, 0.2);

            expect(moveToLatestExtent.length).toEqual(extent.length);
            expect(moveToLatestExtent[0].getTime()).toEqual(9000);
            expect(moveToLatestExtent[1].getTime()).toEqual(10000);

            var reversedMoveToLatestExtent = sc.util.domain.moveToLatest(reversedExtent, reversedData, 0.2);

            expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
            expect(reversedMoveToLatestExtent[0].getTime()).toEqual(9000);
            expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
        });

        it('should return the data extent if the domain extent is too large', function() {
            var extent = [new Date(1000), new Date(20000)];
            var reversedExtent = [extent[1], extent[0]];

            var moveToLatestExtent = sc.util.domain.moveToLatest(extent, data);

            expect(moveToLatestExtent.length).toEqual(extent.length);
            expect(moveToLatestExtent[0].getTime()).toEqual(1000);
            expect(moveToLatestExtent[1].getTime()).toEqual(10000);

            var reversedMoveToLatestExtent = sc.util.domain.moveToLatest(reversedExtent, reversedData);

            expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
            expect(reversedMoveToLatestExtent[0].getTime()).toEqual(1000);
            expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
        });

    });
}(d3, fc, sc));
