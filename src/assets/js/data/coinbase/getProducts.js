import d3 from 'd3';
import model from '../../model/model';

export default function(callback) {
    d3.json('https://api.exchange.coinbase.com/products', function(error, response) {
        if (error) {
            callback(error);
            return;
        }
        callback(error, response);
    });
}
