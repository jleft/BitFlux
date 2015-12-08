import makeDatum from '../../helpers/makeDatum';
import moveToLatest from '../../../src/assets/js/util/domain/moveToLatest';

describe('util/domain/moveToLatest', function() {

    var data;
    var reversedData;

    beforeEach(function() {
        data = [makeDatum(1000), makeDatum(10000)];
        reversedData = [data[1], data[0]];
    });

    it('should keep the extent size the same by default', function() {
        var extent = [new Date(1000), new Date(6000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(extent, data);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(5000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(reversedExtent, reversedData);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should move the extent to end at the last data point if extent ends before the data', function() {
        var extent = [new Date(1000), new Date(6000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(extent, data);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(5000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(reversedExtent, reversedData);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should move the extent to end at the last data point if extent ends after the data', function() {
        var extent = [new Date(11000), new Date(16000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(extent, data);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(5000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(reversedExtent, reversedData);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should scale the extent in proportion to the inputted value', function() {
        var extent = [new Date(1000), new Date(6000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(extent, data, 0.2);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(9000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(reversedExtent, reversedData, 0.2);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(9000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should return the data extent if the domain extent is too large', function() {
        var extent = [new Date(1000), new Date(20000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(extent, data);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(1000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(reversedExtent, reversedData);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(1000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

});
