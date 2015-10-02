(function(d3, fc, sc) {
    'use strict';

    describe('sc.util.domain.padYDomain', function() {

        var domain;

        beforeEach(function() {
            domain = [100, 150];
        });

        it('should pad the domain by a positive percentage', function() {
            expect(sc.util.domain.padYDomain(domain, 0.1)).toEqual([95, 155]);
        });

        it('should pad the domain by a negative percentage', function() {
            expect(sc.util.domain.padYDomain(domain, -0.1)).toEqual([105, 145]);
        });

        it('should pad the domain by nothing when the percentage is zero', function() {
            expect(sc.util.domain.padYDomain(domain, 0)).toEqual([100, 150]);
        });

        it('should pad a specific side of the domain by a positive percentage', function() {
            expect(sc.util.domain.padYDomain(domain, [0, 0.1])).toEqual([100, 155]);
        });

        it('should pad a specific side of the domain by a negative percentage', function() {
            expect(sc.util.domain.padYDomain(domain, [-0.1, 0])).toEqual([105, 150]);
        });

        it('should be able to pad the sides of the domain independently', function() {
            expect(sc.util.domain.padYDomain(domain, [-0.1, 0.1])).toEqual([105, 155]);
        });

        it('should pad the domain by nothing when the percentage array is zero', function() {
            expect(sc.util.domain.padYDomain(domain, [0, 0])).toEqual([100, 150]);
        });

        it('should work for a reversed domain', function() {
            var reversedDomain = [150, 100];

            expect(sc.util.domain.padYDomain(reversedDomain, 0.1)).toEqual([155, 95]);
            expect(sc.util.domain.padYDomain(reversedDomain, -0.1)).toEqual([145, 105]);
            expect(sc.util.domain.padYDomain(reversedDomain, 0)).toEqual([150, 100]);
            expect(sc.util.domain.padYDomain(reversedDomain, [0.1, 0])).toEqual([155, 100]);
            expect(sc.util.domain.padYDomain(reversedDomain, [0, -0.1])).toEqual([150, 105]);
            expect(sc.util.domain.padYDomain(reversedDomain, [0.1, -0.1])).toEqual([155, 105]);
            expect(sc.util.domain.padYDomain(reversedDomain, [0, 0])).toEqual([150, 100]);
        });

    });
})(d3, fc, sc);