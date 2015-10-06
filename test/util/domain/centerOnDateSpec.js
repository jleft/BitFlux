(function(d3, fc, sc) {
    'use strict';

    describe('sc.util.domain.centerOnDate', function() {

        function obj(val) {
            return {
                date: new Date(val)
            };
        }

        var domain;
        var reversedDomain;
        var data;
        var shuffledData;

        var monday = new Date(2015, 7, 17);
        var tuesday = new Date(2015, 7, 18);
        var wednesday = new Date(2015, 7, 19);
        var thursday = new Date(2015, 7, 20);
        var friday = new Date(2015, 7, 21);

        beforeEach(function() {
            domain = [tuesday, thursday];
            reversedDomain = [thursday, tuesday];
            data = [obj(monday), obj(tuesday), obj(wednesday), obj(thursday), obj(friday)];
            shuffledData = [obj(thursday), obj(wednesday), obj(monday), obj(friday), obj(tuesday)];
        });

        it('should center on a different date contained strictly within the valid range for the domain', function() {
            var centerDate = thursday;

            var centerOnDateDomain = sc.util.domain.centerOnDate(domain, data, centerDate);

            expect(centerOnDateDomain.length).toEqual(domain.length);
            expect(centerOnDateDomain[0]).toEqual(wednesday);
            expect(centerOnDateDomain[1]).toEqual(friday);

            var shuffledCenterOnDateDomain = sc.util.domain.centerOnDate(reversedDomain, shuffledData, centerDate);

            expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
            expect(shuffledCenterOnDateDomain[0]).toEqual(wednesday);
            expect(shuffledCenterOnDateDomain[1]).toEqual(friday);
        });

        it('should be able to center on itself', function() {
            var centerDate = wednesday;

            var centerOnDateDomain = sc.util.domain.centerOnDate(domain, data, centerDate);

            expect(centerOnDateDomain.length).toEqual(domain.length);
            expect(centerOnDateDomain[0]).toEqual(tuesday);
            expect(centerOnDateDomain[1]).toEqual(thursday);

            var shuffledCenterOnDateDomain = sc.util.domain.centerOnDate(reversedDomain, shuffledData, centerDate);

            expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
            expect(shuffledCenterOnDateDomain[0]).toEqual(tuesday);
            expect(shuffledCenterOnDateDomain[1]).toEqual(thursday);
        });

        it('should be able to center on the earliest date of the domain', function() {
            var earliestDate = monday;

            var centerOnDateDomain = sc.util.domain.centerOnDate(domain, data, earliestDate);

            expect(centerOnDateDomain.length).toEqual(domain.length);
            expect(centerOnDateDomain[0]).toEqual(monday);
            expect(centerOnDateDomain[1]).toEqual(wednesday);

            var shuffledCenterOnDateDomain = sc.util.domain.centerOnDate(reversedDomain, shuffledData, earliestDate);

            expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
            expect(shuffledCenterOnDateDomain[0]).toEqual(monday);
            expect(shuffledCenterOnDateDomain[1]).toEqual(wednesday);

        });

        it('should be able to center on the latest date of the domain', function() {
            var latestDate = friday;

            var centerOnDateDomain = sc.util.domain.centerOnDate(domain, data, latestDate);

            expect(centerOnDateDomain.length).toEqual(domain.length);
            expect(centerOnDateDomain[0]).toEqual(wednesday);
            expect(centerOnDateDomain[1]).toEqual(friday);

            var shuffledCenterOnDateDomain = sc.util.domain.centerOnDate(reversedDomain, shuffledData, latestDate);

            expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
            expect(shuffledCenterOnDateDomain[0]).toEqual(wednesday);
            expect(shuffledCenterOnDateDomain[1]).toEqual(friday);
        });

        it('should not center on a different date that is not contained within the data domain range', function() {
            var centerDate = d3.time.day.offset(friday, 1);

            var centerOnDateDomain = sc.util.domain.centerOnDate(domain, data, centerDate);

            expect(centerOnDateDomain.length).toEqual(domain.length);
            expect(centerOnDateDomain[0]).toEqual(tuesday);
            expect(centerOnDateDomain[1]).toEqual(thursday);

            var shuffledCenterOnDateDomain = sc.util.domain.centerOnDate(reversedDomain, shuffledData, centerDate);

            expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
            expect(shuffledCenterOnDateDomain[0]).toEqual(tuesday);
            expect(shuffledCenterOnDateDomain[1]).toEqual(thursday);
        });

    });
})(d3, fc, sc);