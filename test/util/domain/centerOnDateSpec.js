(function(d3, fc, sc) {
    'use strict';

    describe('sc.util.domain.centerOnDate', function() {

        function obj(val) {
            return {
                date: new Date(val)
            };
        }

        var domain;
        var data;
        var reverseDomain;
        var mixedData;
        var monday = new Date(2015, 7, 17);
        var tuesday = new Date(2015, 7, 18);
        var wednesday = new Date(2015, 7, 19);
        var thursday = new Date(2015, 7, 20);
        var friday = new Date(2015, 7, 21);

        beforeEach(function() {
            domain = [tuesday, thursday];
            reverseDomain = [thursday, tuesday];
            data = [obj(monday), obj(tuesday), obj(wednesday), obj(thursday), obj(friday)];
            mixedData = [obj(thursday), obj(friday), obj(tuesday), obj(monday), obj(wednesday)];
        });

        it('should center on a different date contained strictly within the valid range for the domain', function() {
            var centerDate = thursday;
            expect(sc.util.domain.centerOnDate(domain, data, centerDate)).toEqual([wednesday, friday]);
        });

        it('should be able to center on itself', function() {
            var centerDate = wednesday;
            expect(sc.util.domain.centerOnDate(domain, data, centerDate)).toEqual([tuesday, thursday]);
        });

        it('should center on a different date not contained strictly within the valid range for the domain',
            function() {
            var earliestDate = monday;
            expect(sc.util.domain.centerOnDate(domain, data, earliestDate)).toEqual([monday, wednesday]);

            var latestDate = friday;
            expect(sc.util.domain.centerOnDate(domain, data, latestDate)).toEqual([wednesday, friday]);
        });

        it('should not center on a different date that is not contained within the data domain range', function() {
            var centerDate = d3.time.day.offset(friday, 1);
            expect(sc.util.domain.centerOnDate(domain, data, centerDate)).toEqual([tuesday, thursday]);
        });

        it('should return expected values when called with unordered data and domain', function() {
            var centerDates = [thursday, wednesday, monday, d3.time.day.offset(friday, 1)];

            expect(sc.util.domain.centerOnDate(reverseDomain, mixedData, centerDates[0])).toEqual([wednesday, friday]);
            expect(sc.util.domain.centerOnDate(reverseDomain, mixedData, centerDates[1])).toEqual([tuesday, thursday]);
            expect(sc.util.domain.centerOnDate(reverseDomain, mixedData, centerDates[2])).toEqual([monday, wednesday]);
            expect(sc.util.domain.centerOnDate(reverseDomain, mixedData, centerDates[3])).toEqual([tuesday, thursday]);
        });

    });
})(d3, fc, sc);