import d3 from 'd3';
import app from '../src/assets/js/app';

describe('app', function() {

    var application;

    beforeEach(function() {
        application = app();
    });

    afterEach(function() {
        application = undefined;
    });

    describe('fetchCoinbaseProducts', function() {
        it('should be set to false by default', function() {
            expect(application.fetchCoinbaseProducts()).toBe(false);
        });
        it('should allow a value to be set to true/false', function() {
            application.fetchCoinbaseProducts(true);
            expect(application.fetchCoinbaseProducts()).toBe(true);
            application.fetchCoinbaseProducts(false);
            expect(application.fetchCoinbaseProducts()).toBe(false);
        });
        it('should return the application when setting a value', function() {
            expect(application.fetchCoinbaseProducts(true)).toEqual(application);
        });
    });

    describe('changeQuandlProduct', function() {
        // TODO
        xit('should return the application', function(done) {
            expect(application.changeQuandlProduct('GOOG')).toEqual(application);
            setTimeout(function() { done(); }, 1000);
        });
    });

    describe('proportionOfDataToDisplayByDefault', function() {
        it('should be set to 0.2 by default', function() {
            expect(application.proportionOfDataToDisplayByDefault()).toBe(0.2);
        });
        it('should allow a value to be set to true/false', function() {
            application.proportionOfDataToDisplayByDefault(0.5);
            expect(application.proportionOfDataToDisplayByDefault()).toBe(0.5);
        });
        it('should return the application when setting a value', function() {
            expect(application.proportionOfDataToDisplayByDefault(0.4)).toEqual(application);
        });
    });

    describe('quandlApiKey', function() {
        it('should not be set by default', function() {
            expect(application.quandlApiKey()).toBeNull();
        });
        it('should allow a value to be set', function() {
            var key = 'APIKEY';
            application.quandlApiKey(key);
            expect(application.quandlApiKey()).toEqual(key);
        });
        it('should return the application when setting the key', function() {
            expect(application.quandlApiKey('APIKEY')).toEqual(application);
        });
    });

    describe('periodsOfDataToFetch', function() {
        it('should be set to 200 by default', function() {
            expect(application.periodsOfDataToFetch()).toBe(200);
        });
        it('should allow a value to be set', function() {
            application.periodsOfDataToFetch(1000);
            expect(application.periodsOfDataToFetch()).toBe(1000);
        });
        it('should return the application when setting the periods of data to fetch', function() {
            expect(application.periodsOfDataToFetch(20)).toEqual(application);
        });
    });

    describe('run', function() {
        var body,
            div,
            divWithClass,
            divWithId;
        beforeEach(function() {
            body = d3.select('body');
            div = body.append('div');
            divWithClass = body.append('div').attr('class', 'foo');
            divWithId = body.append('div').attr('id', 'bar');
        });
        afterEach(function() {
            body.selectAll('*').remove();
        });
        it('should run with an element', function(done) {
            var element = document.createElement('div');
            expect(element.childElementCount).toBe(0);
            application.run(element);
            expect(element.childElementCount).toBeGreaterThan(0);
            setTimeout(function() { done(); }, 1000);
        });
        it('should run with by selecing an element by element name', function(done) {
            expect(div.node().childElementCount).toBe(0);
            application.run('div');
            expect(div.node().childElementCount).toBeGreaterThan(0);
            setTimeout(function() { done(); }, 1000);
        });
        it('should run with by selecing an element by class name', function(done) {
            expect(divWithClass.node().childElementCount).toBe(0);
            application.run('.foo');
            expect(divWithClass.node().childElementCount).toBeGreaterThan(0);
            setTimeout(function() { done(); }, 1000);
        });
        it('should run with by selecing an element by id', function(done) {
            expect(divWithId.node().childElementCount).toBe(0);
            application.run('#bar');
            expect(divWithId.node().childElementCount).toBeGreaterThan(0);
            setTimeout(function() { done(); }, 1000);
        });
        it('should throw an error if it is called without an argument', function() {
            expect(function() {
                application.run();
            })
            .toThrow(new Error('An element must be specified when running the application.'));
        });
    });

});
