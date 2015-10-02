(function(d3, fc, sc) {
    'use strict';

    describe('sc.util.domain.trackingLatestData', function() {

        function obj(val) {
            return {
                date: new Date(val)
            };
        }

        var data;
        var mixedData;
        var monday = new Date(2015, 7, 17);
        var tuesday = new Date(2015, 7, 18);
        var wednesday = new Date(2015, 7, 19);
        var thursday = new Date(2015, 7, 20);
        var friday = new Date(2015, 7, 21);

        beforeEach(function() {
            data = [obj(monday), obj(tuesday), obj(wednesday), obj(thursday), obj(friday)];
            mixedData = [obj(wednesday), obj(monday), obj(friday), obj(thursday), obj(tuesday)];
        });

        it('should return true if latest domain time is equal to latest data time', function() {
            var domain = [tuesday, friday];
            expect(sc.util.domain.trackingLatestData(domain, data)).toBe(true);
        });

        it('should return false if latest domain time is less than latest data time', function() {
            var domain = [tuesday, thursday];
            expect(sc.util.domain.trackingLatestData(domain, data)).toBe(false);
        });

        it('should return false if latest domain time is more than latest data time', function() {
            var domain = [tuesday, d3.time.day.offset(friday, 1)];
            expect(sc.util.domain.trackingLatestData(domain, data)).toBe(false);
        });

        it('should return false if domain time does not coincide with data times', function() {
            var domain = [d3.time.day.offset(friday, 1), d3.time.day.offset(friday, 2)];
            expect(sc.util.domain.trackingLatestData(domain, data)).toBe(false);
        });

        it('should return expected values when called with unordered data and domain', function() {
            var domains = [[friday, tuesday],
                [thursday, tuesday],
                [d3.time.day.offset(friday, 1), tuesday],
                [d3.time.day.offset(friday, 2), d3.time.day.offset(friday, 1)]];

            expect(sc.util.domain.trackingLatestData(domains[0], mixedData)).toBe(true);
            expect(sc.util.domain.trackingLatestData(domains[1], mixedData)).toBe(false);
            expect(sc.util.domain.trackingLatestData(domains[2], mixedData)).toBe(false);
            expect(sc.util.domain.trackingLatestData(domains[3], mixedData)).toBe(false);
        });

    });
})(d3, fc, sc);