import formatProducts from '../../src/assets/js/data/feed/coinbase/formatProducts';

var min1 = 60;
var min5 = 300;
var hr1 = 3600;
var day1 = 86400;

describe('data/coinbase/products', function() {
    it('should assign the correct periods to BTC-USD', function() {
        var btcusd = [{ id: 'BTC-USD' }];
        var productResponse = formatProducts(min1, min5, hr1, day1, btcusd);
        expect(productResponse[0].periods.length).toEqual(4);
        expect(productResponse[0].periods[0]).toEqual(min1);
        expect(productResponse[0].periods[1]).toEqual(min5);
        expect(productResponse[0].periods[2]).toEqual(hr1);
        expect(productResponse[0].periods[3]).toEqual(day1);
    });

    it('should assign the correct periods to BTC-GBP', function() {
        var btcgbp = [{ id: 'BTC-GBP' }];
        var productResponse = formatProducts(min1, min5, hr1, day1, btcgbp);
        expect(productResponse[0].periods.length).toEqual(2);
        expect(productResponse[0].periods[0]).toEqual(hr1);
        expect(productResponse[0].periods[1]).toEqual(day1);
    });

    it('should assign the correct periods to BTC-EUR', function() {
        var btceur = [{ id: 'BTC-EUR' }];
        var productResponse = formatProducts(min1, min5, hr1, day1, btceur);
        expect(productResponse[0].periods.length).toEqual(2);
        expect(productResponse[0].periods[0]).toEqual(hr1);
        expect(productResponse[0].periods[1]).toEqual(day1);
    });

    it('should assign the correct periods to BTC-CAD', function() {
        var btccad = [{ id: 'BTC-CAD' }];
        var productResponse = formatProducts(min1, min5, hr1, day1, btccad);
        expect(productResponse[0].periods.length).toEqual(2);
        expect(productResponse[0].periods[0]).toEqual(hr1);
        expect(productResponse[0].periods[1]).toEqual(day1);
    });
});
