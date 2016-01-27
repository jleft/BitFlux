import BitFlux from './bitflux';

BitFlux.app()
    .fetchCoinbaseProducts(true)
    .run('#app-container');
