import d3 from 'd3';
import model from '../../../model/model';

export default function(minute1, minute5, hour1, day1, callback) {
    d3.json('https://api.exchange.coinbase.com/products', function(error, response) {
        if (error) {
            callback(error);
        } else {
            callback(error, formatProducts(minute1, minute5, hour1, day1, response));
        }
    });
}

export function formatProducts(minute1, minute5, hour1, day1, response) {
    var products = response.map(function(product) {
        if (product.id !== 'BTC-USD') {
            return {
                family: 'bitcoin',
                display: product.id,
                volumeFormat: '.2f',
                periods: [hour1, day1]
            };
        } else {
            return {
                family: 'bitcoin',
                display: product.id,
                volumeFormat: '.2f',
                periods: [minute1, minute5, hour1, day1]
            };
        }
    });

    // Format the new products correctly
    return products.map(model.data.product);
}
