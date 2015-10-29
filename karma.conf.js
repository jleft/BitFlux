module.exports = function(config) {

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        reporters: ['progress', 'dots'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome', 'Firefox', 'IE', 'PhantomJS'],
        singleRun: false,
        concurrency: Infinity
    })
}
