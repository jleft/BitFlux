(function(d3, fc, sc) {
    'use strict';

    describe('sc.util.domain.trackingLatestData', function() {

        function obj(val) {
            return {
                date: new Date(val)
            };
        }

        var data;
        var shuffledData;

        var monday = new Date(2015, 7, 17);
        var tuesday = new Date(2015, 7, 18);
        var wednesday = new Date(2015, 7, 19);
        var thursday = new Date(2015, 7, 20);
        var friday = new Date(2015, 7, 21);

        beforeEach(function() {
            data = [obj(monday), obj(tuesday), obj(wednesday), obj(thursday), obj(friday)];
            shuffledData = [obj(thursday), obj(wednesday), obj(monday), obj(friday), obj(tuesday)];
        });

        it('should return true if latest domain time is equal to latest data time', function() {
            var domain = [tuesday, friday];
            var reversedDomain = [domain[1], domain[0]];

            expect(sc.util.domain.trackingLatestData(domain, data)).toBe(true);
            expect(sc.util.domain.trackingLatestData(reversedDomain, shuffledData)).toBe(true);
        });

        it('should return false if latest domain time is less than latest data time', function() {
            var domain = [tuesday, thursday];
            var reversedDomain = [domain[1], domain[0]];

            expect(sc.util.domain.trackingLatestData(domain, data)).toBe(false);
            expect(sc.util.domain.trackingLatestData(reversedDomain, shuffledData)).toBe(false);
        });

        it('should return false if latest domain time is more than latest data time', function() {
            var domain = [tuesday, d3.time.day.offset(friday, 1)];
            var reversedDomain = [domain[1], domain[0]];

            expect(sc.util.domain.trackingLatestData(domain, data)).toBe(false);
            expect(sc.util.domain.trackingLatestData(reversedDomain, shuffledData)).toBe(false);
        });

        it('should return false if domain time does not coincide with data times', function() {
            var domain = [d3.time.day.offset(friday, 1), d3.time.day.offset(friday, 2)];
            var reversedDomain = [domain[1], domain[0]];

            expect(sc.util.domain.trackingLatestData(domain, data)).toBe(false);
            expect(sc.util.domain.trackingLatestData(reversedDomain, shuffledData)).toBe(false);
        });

    });
})(d3, fc, sc);