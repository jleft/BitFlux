import d3 from 'd3';
import model from '../../model/model';
import formatProducts from './formatProducts';

export default function(source, minute1, minute5, hour1, day1, callback) {
    d3.json('https://api.exchange.coinbase.com/products', function(error, response) {
        if (error) {
            callback(error);
        } else {
            callback(error, formatProducts(source, minute1, minute5, hour1, day1, response));
        }
    });
}
