(function(d3, fc, sc) {
    'use strict';

    describe('sc.util.domain.filterDataInDateRange', function() {

        function obj(val) {
            return {
                date: val
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


        it('should return all data (without padding) when date range covers the data\'s date extent', function() {
            var domain = [monday, friday];
            var reversedDomain = [friday, monday];

            var filteredData = sc.util.domain.filterDataInDateRange(domain, data);

            expect(filteredData.length).toEqual(data.length);
            expect(filteredData[0].date).toEqual(monday);
            expect(filteredData[1].date).toEqual(tuesday);
            expect(filteredData[2].date).toEqual(wednesday);
            expect(filteredData[3].date).toEqual(thursday);
            expect(filteredData[4].date).toEqual(friday);

            var shuffledFilteredData = sc.util.domain.filterDataInDateRange(reversedDomain, shuffledData);

            expect(shuffledFilteredData.length).toEqual(data.length);
            expect(shuffledFilteredData[0].date).toEqual(monday);
            expect(shuffledFilteredData[1].date).toEqual(tuesday);
            expect(shuffledFilteredData[2].date).toEqual(wednesday);
            expect(shuffledFilteredData[3].date).toEqual(thursday);
            expect(shuffledFilteredData[4].date).toEqual(friday);
        });

        it('should pad either side of the data when the date range is within the data\'s date extent', function() {
            var domain = [wednesday, wednesday];
            var reversedDomain = [wednesday, wednesday];

            var filteredData = sc.util.domain.filterDataInDateRange(domain, data);

            expect(filteredData.length).toEqual(3);
            expect(filteredData[0].date).toEqual(tuesday);
            expect(filteredData[1].date).toEqual(wednesday);
            expect(filteredData[2].date).toEqual(thursday);

            var shuffledFilteredData = sc.util.domain.filterDataInDateRange(reversedDomain, shuffledData);

            expect(shuffledFilteredData.length).toEqual(3);
            expect(shuffledFilteredData[0].date).toEqual(tuesday);
            expect(shuffledFilteredData[1].date).toEqual(wednesday);
            expect(shuffledFilteredData[2].date).toEqual(thursday);
        });

        it('should pad the start of the data' +
            ' when the date range\'s end date is not at the end of the data\'s date extent', function() {
            var domain = [monday, tuesday];
            var reversedDomain = [tuesday, monday];

            var filteredData = sc.util.domain.filterDataInDateRange(domain, data);

            expect(filteredData.length).toEqual(3);
            expect(filteredData[0].date).toEqual(monday);
            expect(filteredData[1].date).toEqual(tuesday);
            expect(filteredData[2].date).toEqual(wednesday);

            var shuffledFilteredData = sc.util.domain.filterDataInDateRange(reversedDomain, shuffledData);

            expect(shuffledFilteredData.length).toEqual(3);
            expect(shuffledFilteredData[0].date).toEqual(monday);
            expect(shuffledFilteredData[1].date).toEqual(tuesday);
            expect(shuffledFilteredData[2].date).toEqual(wednesday);
        });

        it('should pad the end of the data' +
            ' when the date range\'s start date is not at the start of the data\'s date extent',
            function() {
            var domain = [thursday, friday];
            var reversedDomain = [friday, thursday];

            var filteredData = sc.util.domain.filterDataInDateRange(domain, data);

            expect(filteredData.length).toEqual(3);
            expect(filteredData[0].date).toEqual(wednesday);
            expect(filteredData[1].date).toEqual(thursday);
            expect(filteredData[2].date).toEqual(friday);

            var shuffledFilteredData = sc.util.domain.filterDataInDateRange(reversedDomain, shuffledData);

            expect(shuffledFilteredData.length).toEqual(3);
            expect(shuffledFilteredData[0].date).toEqual(wednesday);
            expect(shuffledFilteredData[1].date).toEqual(thursday);
            expect(shuffledFilteredData[2].date).toEqual(friday);
        });

        it('should return the first date when a date range is specified before the first datum\'s date', function() {
            var domain = [d3.time.day.offset(monday, -2), d3.time.day.offset(monday, -1)];
            var reversedDomain = [d3.time.day.offset(monday, -1), d3.time.day.offset(monday, -2)];

            var filteredData = sc.util.domain.filterDataInDateRange(domain, data);

            expect(filteredData.length).toEqual(1);
            expect(filteredData[0].date).toEqual(monday);

            var shuffledFilteredData = sc.util.domain.filterDataInDateRange(reversedDomain, shuffledData);

            expect(shuffledFilteredData.length).toEqual(1);
            expect(shuffledFilteredData[0].date).toEqual(monday);
        });

        it('should return the last date when a date range is specified after the last datum\'s date', function() {
            var domain = [d3.time.day.offset(friday, 1), d3.time.day.offset(friday, 2)];
            var reversedDomain = [d3.time.day.offset(friday, 2), d3.time.day.offset(friday, 1)];

            var filteredData = sc.util.domain.filterDataInDateRange(domain, data);

            expect(filteredData.length).toEqual(1);
            expect(filteredData[0].date).toEqual(friday);

            var shuffledFilteredData = sc.util.domain.filterDataInDateRange(reversedDomain, shuffledData);

            expect(shuffledFilteredData.length).toEqual(1);
            expect(shuffledFilteredData[0].date).toEqual(friday);
        });

    });
}(d3, fc, sc));